// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpResponse,
//   HttpHandler,
//   HttpEvent,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { HttpCancelService } from '../../shared/http-cancel.service';
// @Injectable()
// export class HttpCancelInterceptor implements HttpInterceptor {
//   constructor(private httpCancelService: HttpCancelService) { }

//   intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
//     return next.handle(req).takeUntil(this.httpCancelService.onCancelPendingRequests())
//   }
// }
