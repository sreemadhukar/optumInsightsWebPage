/* @author gmounika */
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({ providedIn: OverviewPageModule })
export class OverviewService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  constructor(private http: HttpClient) {}

  public getOverviewData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    let cparams = new HttpParams();
    if (parameters[1]) {
      cparams = cparams.append('rolling12', parameters[1]);
    }

    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0];
    return combineLatest(
      this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.post(claimsURL, cparams, { headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
}
