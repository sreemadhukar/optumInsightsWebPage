/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  public currentUser: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.ProviderList;
  constructor(private http: HttpClient) {}

  public getProvidersData() {
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*'
      });
      const params = new HttpParams();
      const url = this.APP_URL + this.SERVICE_PATH;
      return this.http.post(url, params, { headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }
}
