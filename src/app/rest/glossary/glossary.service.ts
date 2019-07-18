import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {
  public currentUser: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.BusinessGlossary;
  constructor(private http: HttpClient) {}

  public getBusinessGlossaryData() {
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*',
        'Content-Type': 'application/json'
      });
      const params = new HttpParams();
      const url = this.APP_URL + this.SERVICE_PATH;
      return this.http.get(url, { params, headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }
}
