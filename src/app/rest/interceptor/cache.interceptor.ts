import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestCacheService } from './request-cache.service';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';

const TTL = 1800;

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const url = req.body === null && req.method !== 'POST' ? req.url : req.url + JSON.stringify(req.body);
    const cachedResponse = this.cache.get(url);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
  }

  sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && JSON.parse(sessionStorage.getItem('cache'))) {
          const url = req.body === null && req.method !== 'POST' ? req.url : req.url + JSON.stringify(req.body);
          this.cache.set(url, event, TTL);
        }
      })
    );
  }
}
