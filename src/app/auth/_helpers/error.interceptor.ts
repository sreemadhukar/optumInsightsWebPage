import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_service/authentication.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  isInternal: boolean = environment.internalAccess;
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (this.isInternal) {
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            // location.reload(true); commented this
          }
          const error = err.error.message || err.statusText;
          return throwError(error);
        } else {
          if (err.status === 401) {
            // redirecting to access denied page
            this.router.navigate(['/AccessDenied']);
          }
        }
      })
    );
  }
}
