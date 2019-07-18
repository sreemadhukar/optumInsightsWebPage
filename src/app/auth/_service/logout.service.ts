import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class LogoutService {
  public currentUser: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.LogoutEvent;

  constructor(private http: HttpClient) {}

  public postLogoutEvent(uuid: string) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer =
      !environment.internalAccess && environment.production
        ? this.currentUser[0].AccessToken
        : this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*',
      PedAccessToken: 'Bearer ' + this.currentUser[0].PedAccessToken
    });
    const params = new HttpParams();
    return this.http.post(this.APP_URL + this.SERVICE_PATH + uuid, params, { headers: myHeader });
  }
}
