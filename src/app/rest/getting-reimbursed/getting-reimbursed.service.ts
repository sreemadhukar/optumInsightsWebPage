/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class GettingReimbursedService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private AGG_CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsAgg;
  private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals;
  constructor(private http: HttpClient) {}
  public getGettingReimbursedYearWiseData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    let cparams = new HttpParams();
    if (parameters.length > 1 && parameters[1]) {
      cparams = cparams.append('monthly', parameters[1]);
      cparams = cparams.append('startDate', parameters[2]);
      cparams = cparams.append('endDate', parameters[3]);
    }

    let eparams = new HttpParams();
    if (parameters.length > 4 && parameters[4] !== null && parameters[4] !== undefined) {
      eparams = eparams.append('ReportingPeriod', parameters[4]);
    }
    if (parameters.length > 5 && parameters[5] !== null && parameters[5] !== undefined) {
      eparams = eparams.append('TIN', parameters[5]);
      cparams = cparams.append('TIN', parameters[5]);
    }
    const aggClaimsURL = this.APP_URL + this.AGG_CLAIMS_SERVICE_PATH + parameters[0];
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];
    return combineLatest(
      this.http.post(aggClaimsURL, eparams, { headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.get(appealsURL, { params: cparams, headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
  public getGettingReimbursedData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    let cparams = new HttpParams();
    if (parameters.length > 1 && parameters[1]) {
      cparams = cparams.append('rolling12', parameters[1]);
    } else if (parameters.length > 2 && parameters[2]) {
      cparams = cparams.append('YTD', parameters[2]);
    }
    if (parameters.length > 3 && parameters[3] !== null && parameters[3] !== undefined) {
      cparams = cparams.append('TIN', parameters[3]);
    }

    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0];
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];

    return combineLatest(
      this.http.post(claimsURL, cparams, { headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.get(appealsURL, { params: cparams, headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
}
