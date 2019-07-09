/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GettingReimbursedService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private AGG_CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsAgg;
  private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals;
  private TINS_SERVICE_PATH: string = environment.apiUrls.ProvTinList;
  private PAYMENT_INTEGRITY_PATH: string = environment.apiUrls.PaymentIntegrity;

  constructor(private http: HttpClient) {}
  public getGettingReimbursedYearWiseData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    let cparams = new HttpParams();
    if (parameters.length > 1) {
      cparams = cparams.append('monthly', 'true');
      cparams = cparams.append('startDate', '01-' + parameters[1].TimeFilterText);
      cparams = cparams.append('endDate', '12-' + parameters[1].TimeFilterText);
      if (parameters[1].Lob) {
        cparams = cparams.append('LOB', parameters[1].Lob);
      }
      // if(parameters[1].tin){
      //   cparams = cparams.append('TIN',parameters[1].tin)
      // }
    }

    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];

    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
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
    let aparams = new HttpParams();
    if (parameters[1].Lob) {
      aparams = aparams.append('LOB', parameters[1].Lob);
    }
    // if(parameters[1].tin){
    //   aparams = aparams.append('TIN',parameters[1].tin)
    // }
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];

    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.get(appealsURL, { params: aparams }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }

  /* Function to get Provider TINS of Health System - Ranjith kumar Ankam */
  public getTins(providerKey) {
    const params = new HttpParams();
    const tinsURL = this.APP_URL + this.TINS_SERVICE_PATH + providerKey;

    return this.http.get(tinsURL, { params: params }).pipe(
      retry(2),
      map(res => res),
      catchError(err => of(err))
    );
  }

  /* Function to get Claims Non payments by Facility Data - Ranjith kumar Ankam */
  public getClaimsNonPaymentsData(parameters) {
    let params = new HttpParams();

    params = params.append('monthly', parameters.monthly);
    params = params.append('YTD', parameters.ytd);
    if (parameters.timeperiod !== '') {
      params = params.append('timeFilter', parameters.timeperiod);
    }
    if (parameters.tin !== '') {
      params = params.append('TIN', parameters.tin);
    }
    if (parameters.startDate !== '') {
      params = params.append('startDate', parameters.startDate);
    }
    if (parameters.endDate !== '') {
      params = params.append('endDate', parameters.endDate);
    }
    /*if (parameters.rolling12 !== '') {
      params = params.append('rolling12', parameters.rolling12);
    }
*/
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters.providerkey;
    return this.http.post(claimsURL, params).pipe(
      retry(2),
      map(res => res),
      catchError(err => of(err))
    );
  }

  /* Function to get Payment Integrity Data - Ranjith kumar Ankam */

  public getPaymentIntegrityData(parameters) {
    const piURL = this.APP_URL + this.PAYMENT_INTEGRITY_PATH + parameters.providerkey;
    let params = new HttpParams();

    if (parameters.timeperiod !== '') {
      params = params.append('timeFilter', parameters.timeperiod);
    }
    return this.http.get(piURL, { params: params });
  }

  public getPaymentData(parameters) {
    const params = new HttpParams();
    const bParam = {
      TimeFilter: 'Last6Months'
    };

    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters + '?requestType=PAYMENT_METRICS';
    return this.http.post(claimsURL, bParam).pipe(
      retry(2),
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
