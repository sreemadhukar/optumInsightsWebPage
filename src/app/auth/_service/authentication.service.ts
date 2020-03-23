import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { RESET_KOP_FILTER } from 'src/app/store/kopFilter/actions';
import { NgRedux } from '@angular-redux/store';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.SsoTokenPath;
  private jwtPath: string = environment.originUrl;
  private token: string;
  private currentUserSubject: BehaviorSubject<User>;
  private currentUser: Observable<User>;

  constructor(
    public http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private ngRedux: NgRedux<any>
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getSsoToken(codeId: string, token: string): Observable<any> {
    let myHeader;
    if (token === 'isProd') {
      myHeader = new HttpHeaders({
        Accept: '*/*'
      });
    } else {
      myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + token,
        Accept: '*/*'
      });
    }
    if (!environment.internalAccess) {
      const emulatedUuid = JSON.parse(sessionStorage.getItem('emulatedUuid'));
      if (emulatedUuid) {
        myHeader = myHeader.set('emulatedUuid', emulatedUuid);
      }
    }
    let params = new HttpParams();
    params = params.append('code', codeId);
    const url = this.APP_URL + this.SERVICE_PATH;
    return this.http.post(url, params, { headers: myHeader }).pipe(
      map(ssoTokenData => {
        return ssoTokenData;
      })
    );
  }

  public getJwt() {
    const url = this.jwtPath + 'api/getJwt';
    const myHeader = new HttpHeaders();
    myHeader.set('Accept', '*/*');
    const params = new HttpParams();
    return this.http.get(url, { params }).pipe(
      map(ssoTokenData => {
        return ssoTokenData;
      })
    );
  }

  public logout(expired = 0) {
    // sessionStorage.removeItem('currentUser');
    // sessionStorage.removeItem('loggedUser');
    // sessionStorage.removeItem('heac');
    // sessionStorage.removeItem('pcor');
    // sessionStorage.removeItem('state');
    sessionStorage.clear();
    this.ngRedux.dispatch({ type: RESET_KOP_FILTER });
    sessionStorage.setItem('cache', JSON.stringify(false));
    if (environment.internalAccess) {
      if (expired) {
        this.router.navigate([''], { queryParams: { sessionExpired: true } });
      } else {
        this.router.navigate(['']);
      }
    } else if (!environment.internalAccess) {
      this.document.location.href = environment.apiUrls.SsoLogoutUrl;
    }
  }

  public isLoggedIn() {
    if (sessionStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    } else {
      return false;
    }
  }
}
