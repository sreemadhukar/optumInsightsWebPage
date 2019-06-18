import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { IssueResolutionPageModule } from '../../components/issue-resolution-page/issue-resolution-page.module';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({ providedIn: IssueResolutionPageModule })
export class CallsService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CALLS_SERVICE_PATH: string = environment.apiUrls.Calls;
  constructor(private http: HttpClient) {}

  public getCallsData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    const params = new HttpParams();
    const executiveURL = this.APP_URL + this.CALLS_SERVICE_PATH + parameters[0];
    return combineLatest(
      this.http.get(executiveURL, { params, headers: myHeader }).pipe(
        retry(2),
        map(res => res),
        catchError(err => of(err))
      )
    );
  }
}
