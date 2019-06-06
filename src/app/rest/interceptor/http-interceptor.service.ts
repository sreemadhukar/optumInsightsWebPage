/** Created By  - Ranjith kumar Ankam - 06-June-2019 **/

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
      const token = currentUser[0].PedAccessToken;

      if (token) {
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
      }
    }
    request = request.clone({ headers: request.headers.set('Accept', '*/*') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        /*if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }*/
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        /*let data = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };*/
        return throwError(error);
      })
    );
  }
  constructor() {}
}
