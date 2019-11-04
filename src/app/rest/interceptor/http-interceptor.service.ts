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
    // alert(this.refreshtoken);
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

      return this.getRequestWithAuthentication(request, next);
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
    //  let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWI
    // iOiJpMGpLWVJwdGtmNTNkTDdNWlhjdEhRQ0ZraTRESUdOS3d6NTFKRis1Ymw5TW
    // lWOWVMRkVHRzBsMTJjaFlnaElaNy85YjhJSktwUmUvUTQyR1hUa1hJVi9Kekl
    // nazZMMHhEa3cxR05VVURsQWFOMlVORWkzaS9sWm5DWlpoYjJHSGw1ZGp3N1lHc
    // zZoa0hObVBiSjZnYnNiYjRqenRlVE9UVnFjUWZ6K3J2Lzg9IiwiaXNzIjoiUTln
    // UnBYV2pWbTVHWGV0aE54RzYwdXRHTUdXN05wc08iLCJleHAiOjE1NzE2NzU4ODcs
    // ImF1dGhvcml0aWVzIjoiW1JPTEVfVVNFUl0ifQ.CDTyKhyxkesfw96jWR_yxvz5BCiLp7sM7VifHcEhyZ4`;

    // if (token) {
    //   request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    //   request = request.clone({
    //     headers: request.headers.set('PedAccessToken', 'Bearer ' + currentUser[0].PedAccessToken)
    //   });
    // }
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

    // token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiO
    // iJpMGpLWVJwdGtmNTNkTDdNWlhjdEhRQ0ZraTRESUdOS3d6NTFKRis1
    // Ymw5TWlWOWVMRkVHRzBsMTJjaFlnaElaNy85YjhJSktwUmUvUTQyR1hUa1hJVi
    // 9KeklnazZMMHhEa3cxR05VVURsQWFOMlVORWkzaS9sWm5DWlpoYjJHSGw1ZGp3
    // N1lHczZoa0hObVBiSjZnYnNiYjRqenRlVE9UVnFjUWZ6K3J2Lzg9IiwiaXNzIj
    // oiUTlnUnBYV2pWbTVHWGV0aE54RzYwdXRHTUdXN05wc08iLCJleHAiOjE1NzE2NzU4O
    // DcsImF1dGhvcml0aWVzIjoiW1JPTEVfVVNFUl0ifQ.CDTyKhyxkesfw96jWR_yxvz5BCiLp7sM7VifHcEhyZ4`;

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
