/** Created By  - Ranjith kumar Ankam - 24-Oct-2019 **/

import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { RefreshtokenService } from './refreshtoken.service';
import { Observable } from 'rxjs';
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // To avoid cyclic dependency
    // const auth = this.injector.get(OAuthService);

    // if (auth.hasAuthorization()) {
    //   return this.getRequestWithAuthentication(request, next, auth);
    // } else if (auth.hasAuthorizationRefresh() && request.url !== AUTHORIZE_URL) {
    //   return auth.refreshToken().flatMap(
    //     (res: any) => {
    //       auth.saveTokens(res);
    //       return this.getRequestWithAuthentication(request, next, auth);
    //     }
    //   ).catch(() => {
    //     return next.handle(request);
    //   });
    // } else if (request.url === AUTHORIZE_URL) {
    //   return next.handle(request);
    // }

    return this.getRequestWithAuthentication(request, next);
  }

  private getRequestWithAuthentication(
    request: HttpRequest<any>,
    next: HttpHandler
    // auth: OAuthService
  ): Observable<HttpEvent<any>> {
    const req = request.clone({
      headers: request.headers.set('Authorization', '')
    });
    return next.handle(req);
  }
}
