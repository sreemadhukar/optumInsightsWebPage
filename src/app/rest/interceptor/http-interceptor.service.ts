/** Created By  - Ranjith kumar Ankam - 06-June-2019 **/

import { Injectable, EventEmitter } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  protected emitter = new EventEmitter<boolean>();
  refreshtoken = false;

  constructor(public http: HttpClient) {
    this.emitter.pipe().subscribe(text => (this.refreshtoken = text));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
      if (date === undefined || date === null) {
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
