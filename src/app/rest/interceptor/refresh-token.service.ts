import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private APP_URL: string = environment.apiProxyUrl;
  private Refresh_Token_Path: string = environment.apiUrls.RefreshToken;
  constructor(private http: HttpClient) {}

  public getRefreshToken(sub) {
    const url = this.APP_URL + this.Refresh_Token_Path;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const RefreshToken = currentUser[0].RefreshToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + RefreshToken,
      Accept: '*/*'
    });
    // const tParams = {
    //   sub: sub
    // };
    return this.http.post(url, '', { headers: myHeader });
    // .pipe(map(ssoTokenData => {
    //   // return ssoTokenData;
    //   console.log('REFRESH TOKEN DATA');
    //   console.log('a-----' + ssoTokenData.headers.get('Authorization'));
    //   console.log('R-----' + ssoTokenData.headers.get('RefreshToken'));
    //   console.log('//REFRESH TOKEN DATA//');
    //   return ssoTokenData.headers;
    // }));
  }
}