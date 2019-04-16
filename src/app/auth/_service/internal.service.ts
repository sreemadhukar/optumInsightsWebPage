import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JSEncrypt } from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class InternalService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.LDAPAuth;
  private sso: any;
  private tempUser: any;
  private returnUrl: any;

  constructor(public http: HttpClient, public router: Router) {}

  login(userName, password) {
    if (sessionStorage.getItem('publicKey')) {
      this.returnUrl = '/OverviewPage';
      const url = this.APP_URL + this.SERVICE_PATH;
      const token = JSON.parse(sessionStorage.getItem('token'));
      let params = new HttpParams();
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + token,
        Accept: '*/*'
      });
      params = params.append('username', userName);
      params = params.append('password', this.getEncryptedString(password));
      return this.http.post(url, params, { headers: myHeader }).pipe(
        map(
          user => {
            if (typeof user !== 'undefined' && user !== null) {
              // this.loader = false;
              this.tempUser = user;
              this.sso = [];
              this.sso.push({
                PedAccessToken: this.tempUser.PedAccessToken
              });
              sessionStorage.setItem('currentUser', JSON.stringify(this.sso));
              sessionStorage.setItem('loggedUser', JSON.stringify(user));
              this.router.navigate([this.returnUrl]);
              return user;
            } else {
              //    this.loader = false;
              alert('please enter valid MS ID and Password');
              return false;
            }
          },
          error => {
            //     this.loader = false;
            console.log('Login service error', error.status);
            environment.errorMessage = error.status;
            //     this.checkErrorService.checkError(error);
          }
        )
      );
    } else {
      this.getPublicKey(userName, password);
    }
  }

  getPublicKey(userName, password) {
    const url = this.APP_URL + 'getPublicKey';
    const token = JSON.parse(sessionStorage.getItem('token'));
    const params = new HttpParams();
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      Accept: '*/*'
    });
    return this.http.post(url, params, { headers: myHeader }).subscribe(async data => {
      sessionStorage.setItem('publicKey', JSON.stringify(data));
      await this.login(userName, password);
    });
  }

  getEncryptedString(param) {
    const encrypt = new JSEncrypt();
    const publicKey = JSON.parse(sessionStorage.getItem('publicKey'));
    encrypt.setPublicKey(publicKey[0].publicKey);
    return encrypt.encrypt(param);
  }
}
