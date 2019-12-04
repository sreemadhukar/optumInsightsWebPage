import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { StorageService } from '../../shared/storage-service.service';
import { ErrorHandlingService } from '../error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {
  protected code: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private storageService: StorageService,
    private checkErrorService: ErrorHandlingService,
    @Inject(DOCUMENT) private document: any
  ) {}

  public CheckExternal(code, token) {
    return new Promise((resolve, rej) => {
      // this.authService.logout();
      return this.authService.getSsoToken(code, token).subscribe(
        ssoTokenData => {
          if (typeof ssoTokenData !== 'undefined' && ssoTokenData !== null && ssoTokenData.length !== 0) {
            this.storageService.store('currentUser', ssoTokenData);
            const user = { FirstName: ssoTokenData[0].FirstName, LastName: ssoTokenData[0].LastName };
            this.storageService.store('loggedUser', user);
            resolve(ssoTokenData[0]);
          } else {
            rej(new Error('error'));
          }
        },
        error => {
          console.log('Login service error', error.status);
          environment.errorMessage = error.status;
          this.checkErrorService.checkError(error);
          this.document.location.href = environment.apiUrls.SsoRedirectUri;
        }
      );
    });
  }
}
