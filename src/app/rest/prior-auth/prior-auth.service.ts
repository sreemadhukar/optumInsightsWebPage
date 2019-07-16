/* @author Sparsh Kumar */
import { Injectable } from '@angular/core';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriorAuthService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private SERVICE_PATH: string = environment.apiUrls.PriorAuth;
  constructor(private http: HttpClient) {}

  public getPriorAuthData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];

    return this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getPriorAuthDateRange(
    timeRange: string,
    allTin: boolean,
    allLOB: boolean,
    isAllSS: boolean,
    isDecisionType: boolean,
    ...parameters
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    const opts = { headers: myHeader };

    let params = new HttpParams();
    const url = this.APP_URL + this.SERVICE_PATH + parameters[0];

    if (timeRange === 'customDateRange') {
      params = params.append('startDate', parameters[1]);
      params = params.append('endDate', parameters[2]);
      if (allTin) {
        params = params.append('allProviderTins', parameters[3]);
      } else {
        params = params.append('allProviderTins', parameters[3]);
        if (parameters[4] !== false) {
          params = params.append('providerTin', parameters[4]);
        }
      }
      /*lob  */
      if (allLOB) {
        params = params.append('allLob', parameters[5]);
      } else {
        params = params.append('cAndSLob', parameters[6]);
        params = params.append('eAndILob', parameters[7]);
        params = params.append('mAndRLob', parameters[8]);
      }
    } else if (timeRange === 'calenderYear') {
      params = params.append(timeRange, parameters[1]);
      params = params.append('reportingPeriod', parameters[2]);
      if (allTin) {
        params = params.append('allProviderTins', parameters[3]);
      } else {
        params = params.append('allProviderTins', parameters[3]);
        if (parameters[4] !== false) {
          params = params.append('providerTin', parameters[4]);
        }
      }
      /*lob  */
      if (allLOB) {
        params = params.append('allLob', parameters[5]);
      } else {
        params = params.append('cAndSLob', parameters[6]);
        params = params.append('eAndILob', parameters[7]);
        params = params.append('mAndRLob', parameters[8]);
      }
    } else if (timeRange === 'yearComparision') {
      params = params.append(timeRange, parameters[1]);
      params = params.append('reportingPeriod', parameters[2]);
      if (allTin) {
        params = params.append('allProviderTins', parameters[3]);
      } else {
        params = params.append('allProviderTins', parameters[3]);
        if (parameters[4] !== false) {
          params = params.append('providerTin', parameters[4]);
        }
      }
      /**LOB FILTER STARTS*/
      if (allLOB) {
        params = params.append('allLob', parameters[5]);
      } else {
        params = params.append('cAndSLob', parameters[6]);
        params = params.append('eAndILob', parameters[7]);
        params = params.append('mAndRLob', parameters[8]);
      }
      /**LOB FILTER ENDS */
    } else {
      params = params.append(timeRange, parameters[1]);
      if (allTin) {
        params = params.append('allProviderTins', parameters[3]);
      } else {
        params = params.append('allProviderTins', parameters[3]);
        if (parameters[4] !== false) {
          params = params.append('providerTin', parameters[4]);
        }
      }
      /*lob  */
      if (allLOB) {
        params = params.append('allLob', parameters[5]);
      } else {
        params = params.append('cAndSLob', parameters[6]);
        params = params.append('eAndILob', parameters[7]);
        params = params.append('mAndRLob', parameters[8]);
      }
    }
    if (isAllSS) {
      params = params.append('allNotApprovedSettings', parameters[9]);
    }
    if (isDecisionType) {
      params = params.append('decisionType', parameters[10]);
      params = params.append('decisionValue', parameters[11]);
    }

    return this.http.post(url, params, { headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
