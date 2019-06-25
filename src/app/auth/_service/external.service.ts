import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { StorageService } from '../../shared/storage-service.service';

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
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: any
  ) {}

  public CheckExternal(code, token) {
    return new Promise(resolve => {
      this.authService.logout();
      return this.authService.getSsoToken(code, token).subscribe(
        ssoTokenData => {
          if (typeof ssoTokenData !== 'undefined' && ssoTokenData !== null) {
            this.sso = ssoTokenData;
            this.storageService.store('currentUser', this.sso);
            const user = { FirstName: this.sso[0].FirstName, LastName: this.sso[0].LastName };
            this.storageService.store('loggedUser', user);
            resolve(this.sso);
          }
        },
        error => {
          console.log('Login service error', error.status);
          environment.errorMessage = error.status;
          //  this.checkErrorService.checkError(error);
          //  this.document.location.href = redirectUri;
        }
      );
    });
  }

  // CheckExternalTest() {
  //   const redirectUri = environment.apiUrls.SsoRedirectUri;
  //   if (this.route.queryParams) {
  //     this.route.queryParams.subscribe(params => {
  //       this.code = params.code;
  //       if (this.code) {
  //         // this.authService.logout();
  //         this.returnUrl = '/OverviewPage';
  //         this.authService.getSsoToken(this.code).subscribe(
  //           ssoTokenData => {
  //             if (typeof ssoTokenData !== 'undefined' && ssoTokenData !== null) {
  //               this.sso = ssoTokenData;
  //               sessionStorage.setItem('currentUser', JSON.stringify(this.sso));
  //               const user = { FirstName: this.sso.FirstName, LastName: this.sso.LastName };
  //               // console.log(user);
  //
  //               sessionStorage.setItem('loggedUser', JSON.stringify(user));
  //               this.router.navigate([this.returnUrl]);
  //             }
  //           },
  //           error => {
  //             console.log('Login service error', error.status);
  //             environment.errorMessage = error.status;
  //             // this.checkErrorService.checkError(error);
  //             //  this.document.location.href = redirectUri;
  //           }
  //         );
  //       } else {
  //         this.authService.logout();
  //         // this.returnUrl = '/OverviewPage';commented this
  //         // this.document.location.href = redirectUri;
  //         // this.router.navigate([this.returnUrl]);commented this
  //       }
  //     });
  //
  //     // get return url from route parameters or default to '/'
  //   } else {
  //     // this.document.location.href = redirectUri;commented this
  //     // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/ExecutiveSummary';commented this
  //     this.router.navigate([this.returnUrl]); // added this
  //   }
  // }
}
