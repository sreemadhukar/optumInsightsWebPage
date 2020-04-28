import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { StorageService } from '../../shared/storage-service.service';
import { ErrorHandlingService } from '../error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {
  protected code: string;

  constructor(
    private authService: AuthenticationService,
    private storageService: StorageService,
    private checkErrorService: ErrorHandlingService
  ) {}

  public CheckExternal(code, token) {
    return new Promise((resolve, rej) => {
      // this.authService.logout();
      return this.authService.getSsoToken(code, token).subscribe(
        ssoTokenData => {
          if (typeof ssoTokenData !== 'undefined' && ssoTokenData !== null && ssoTokenData.length !== 0) {
            this.storageService.store('currentUser', ssoTokenData);
            const user = {
              FirstName: ssoTokenData[0].FirstName,
              LastName: ssoTokenData[0].LastName,
              EmailId: ssoTokenData[0].EmailId,
              MsId: '',
              OptumId: ''
            };
            if (ssoTokenData[0].hasOwnProperty('MsId')) {
              user.MsId = ssoTokenData[0].MsId;
            }
            if (ssoTokenData[0].hasOwnProperty('OptumId')) {
              user.OptumId = ssoTokenData[0].OptumId;
            }
            this.storageService.store('loggedUser', user);
            resolve(ssoTokenData[0]);
          } else {
            // alert(ssoTokenData.length);
            rej(new Error('error'));
          }
        },
        error => {
          console.log('Login service error', error.status);
          environment.errorMessage = error.status;
          this.checkErrorService.checkError(error);
          rej(new Error('error'));
          // this.document.location.href = environment.apiUrls.SsoRedirectUri;
        }
      );
    });
  }
}
