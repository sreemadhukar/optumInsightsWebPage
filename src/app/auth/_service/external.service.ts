import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {
  protected code: string;
  private returnUrl: string;
  private sso: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private errorHandlingService: ErrorHandlingService,
    @Inject(DOCUMENT) private document: any
  ) {}

  CheckExternal(token) {
    const redirectUri = environment.apiUrls.SsoRedirectUri;
    if (this.route.queryParams) {
      this.route.queryParams.subscribe(params => {
        this.code = params.code;
        if (this.code) {
          this.removeSession();
          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/OverviewPage';
          this.authService.getSsoToken(this.code, token).subscribe(
            ssoTokenData => {
              if (typeof ssoTokenData !== 'undefined' && ssoTokenData !== null) {
                console.log(ssoTokenData);
                this.sso = ssoTokenData;
                sessionStorage.setItem('currentUser', JSON.stringify(this.sso));
                const user = { FirstName: this.sso.FirstName, LastName: this.sso.LastName };
                sessionStorage.setItem('loggedUser', JSON.stringify(user));
                this.router.navigate([this.returnUrl]);
              }
            },
            error => {
              console.log('Login service error', error.status);
              environment.errorMessage = error.status;
              this.errorHandlingService.checkError(error);
              this.document.location.href = redirectUri;
            }
          );
        } else {
          this.document.location.href = redirectUri;
        }
      });

      // get return url from route parameters or default to '/'
    } else {
      this.document.location.href = redirectUri;
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/OverviewPage';
    }
  }

  removeSession() {
    sessionStorage.removeItem('currentUser');
  }
}
