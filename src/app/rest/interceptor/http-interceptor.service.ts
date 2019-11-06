/** Created By  - Ranjith kumar Ankam - 06-June-2019 **/

import { Injectable, EventEmitter } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { RefreshTokenService } from './refresh-token.service';
import { StorageService } from 'src/app/shared/storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  protected emitter = new EventEmitter<boolean>();
  refreshtoken = false;

  constructor(
    public http: HttpClient,
    private refreshtokenservice: RefreshTokenService,
    private storage: StorageService
  ) {
    this.emitter.pipe().subscribe(text => (this.refreshtoken = text));
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.internalAccess && environment.production) {
      return this.getRequestWithAuthentication(request, next);
    } else {
      if (this.refreshtoken) {
        this.emitter.emit(false);
        return next.handle(request);
      }
      if (!this.isTokenExpired(request)) {
        this.emitter.emit(false);
        return this.getRequestWithAuthentication(request, next);
      } else if (this.isTokenExpired(request) && !this.refreshtoken) {
        this.emitter.emit(true);
        console.log('API token expired');

        // API call to get new refresh token & save in session
        this.refreshtokenservice.getRefreshToken().subscribe((resp: any) => {
          const providerData = JSON.parse(sessionStorage.getItem('currentUser'));
          const provider = providerData[0];
          if (providerData[0].hasOwnProperty('ProviderKey')) {
            provider.PedAccessToken = resp.Authorization;
            provider.RefreshToken = resp.RefreshToken;
            this.storage.store('currentUser', [provider]);
          }
          return this.getRequestWithAuthentication(request, next);
        });
      }
    }
  }

  private getRequestWithAuthentication(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && request.url.indexOf(environment.originUrl + 'api/getHeac') === -1) {
      const token =
        !environment.internalAccess && environment.production
          ? currentUser[0].AccessToken
          : currentUser[0].PedAccessToken;
      if (token) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        request = request.clone({
          headers: request.headers.set('PedAccessToken', 'Bearer ' + currentUser[0].PedAccessToken)
        });
      }
    }

    request = request.clone({ headers: request.headers.set('Accept', '*/*') });
    return next.handle(request);
  }

  private isTokenExpired(request: HttpRequest<any>): boolean {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let token = '';
    if (currentUser && request.url.indexOf(environment.originUrl + 'api/getHeac') === -1) {
      token =
        !environment.internalAccess && environment.production
          ? currentUser[0].AccessToken
          : currentUser[0].PedAccessToken;
    }

    if (token) {
      const date = this.getTokenExpirationDate(token);
      if (date === undefined) {
        return false;
      }
      return !(date.valueOf() > new Date().valueOf());
    }
    return false;
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
