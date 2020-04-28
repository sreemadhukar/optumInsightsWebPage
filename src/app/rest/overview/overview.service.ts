/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class OverviewService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private PRIOR_AUTH_SERVICE_PATH: string = environment.apiUrls.PriorAuth;
  private CALLS_SERVICE_PATH: string = environment.apiUrls.CallsTrend;
  // private TRENDING_METRICS_PATH: string = environment.apiUrls.TrendingMetrics;

  constructor(private http: HttpClient) {}

  public getOverviewData(...parameters) {
    /*
    let cparams = new HttpParams();
    if (parameters[1]) {
      cparams = cparams.append('timeFilter', 'last6months');
    }
*/
    let tParams = {};
    let ediparams = {};
    let pprparams = {};
    if (parameters.length > 1 && parameters[1]) {
      tParams = {
        TimeFilter: 'Last6Months'
      };
      ediparams = {
        TimeFilter: 'Last6Months',
        submissionTypes: ['EDI']
      };
      pprparams = {
        TimeFilter: 'Last6Months',
        submissionTypes: ['PAPER']
      };
    }
    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';

    return combineLatest(
      this.http.get(executiveURL, { params: eparams }).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.post(claimsURL, tParams).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.post(claimsURL, ediparams).pipe(
        map(res => res[0]),
        catchError(err => of(err))
      ),
      this.http.post(claimsURL, pprparams).pipe(
        map(res => res[0]),
        catchError(err => of(err))
      )
    );
  }

  public getOverviewClaimsTrend(parameters) {
    /*
    let cparams = new HttpParams();
    if (parameters[1]) {
      cparams = cparams.append('timeFilter', 'last6months');
    }
*/
    let tParams = {};
    if (parameters.TimeFilter) {
      tParams = {
        TimeFilter: parameters.TimeFilter
      };
    }

    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters.providerkey + '?requestType=PAYMENT_METRICS';
    return this.http.post(claimsURL, tParams).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getOverviewPriorAuth(parameters) {
    // Adding trends api

    /*
    return combineLatest(
      this.http.post(priorURL, params).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),

      this.http.get(trendsURL).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
     */

    // Sample template
    const requestBodyTemplate = {
      tin: null,
      lob: 'allLob',
      allNotApprovedSettings: true,
      decisionType: false,
      decisionValue: null,
      serviceCategory: false,
      serviceCategoryValue: null,
      timeFilter: 'last6Months',
      timeFilterText: null
    };

    const url = this.APP_URL + this.PRIOR_AUTH_SERVICE_PATH + parameters.providerKey;
    let params = new HttpParams();
    params = params.append('allProviderTins', parameters.allProviderTins);

    return this.http.post(url, requestBodyTemplate, { params: params }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getOverviewTotalCalls(parameters) {
    const prevLastURL =
      this.APP_URL + this.CALLS_SERVICE_PATH + parameters.providerkey + '?time-filter=' + parameters.timeFilter;

    return this.http.get(prevLastURL).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }
}
