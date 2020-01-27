/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
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
  private CLAIMS_SERVICE_PATH_DOP: string = environment.apiUrls.NonPaymentDop;
  private AGG_CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsAgg;
  private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals; // old
  private APPEALS_SERVICE: string = environment.apiUrls.AppealsFHIR; // new
  private APPEALS_OVERTURN: string = environment.apiUrls.AppealsOverturn;
  private TINS_SERVICE_PATH: string = environment.apiUrls.ProvTinList;
  private PAYMENT_INTEGRITY_PATH: string = environment.apiUrls.PaymentIntegrity;
  private APEEALS_FHIR_API_PATH: string = environment.apiUrls.AppealsFHIR;

  constructor(private http: HttpClient) {}
  public getGettingReimbursedYearWiseData(...parameters) {
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.claimsAppealsData(...parameters)
    );
  }

  /*  public appealsData(...parameters) {
    const appealsParams = parameters[1];
    if (!appealsParams.Tin) {
      appealsParams.AllProviderTins = true;
    }
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];
    return this.http.post(appealsURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }*/

  /** function for Appeals PDP api */
  public claimsAppealsData(...parameters) {
    const appealsParam = parameters[1];
    let appealsReqType = '';
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsReqType = '?requestType=APPEALS_MEASURE_DOR_HCO';
    } else {
      appealsReqType = '?requestType=APPEALS_MEASURE_DOC_HCO';
    }
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE + parameters[0] + appealsReqType;
    return this.http.post(appealsURL, appealsParam).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public claimsAppealsReasonData(...parameters) {
    const appealsParam = parameters[1];
    let appealsReqType = '';
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsReqType = '?requestType=APPEALS_TOP_OVERTURNED_REASON_DOR_HCO';
    } else {
      appealsReqType = '?requestType=APPEALS_TOP_OVERTURNED_REASON_DOC_HCO';
    }
    const appealsURL = this.APP_URL + this.APPEALS_OVERTURN + parameters[0] + appealsReqType;
    return this.http.post(appealsURL, appealsParam).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
  /** ----------------------------- */

  public getGettingReimbursedData(...parameters) {
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.claimsAppealsData(...parameters)
    );
  }

  public getPaymentsData(parameters) {
    let claimsURL;
    if (parameters[1]['ClaimsBy'] === 'DateOfProcessing') {
      claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH_DOP + parameters[0] + '?requestType=CLAIMS';
      return this.http.post(claimsURL, parameters[1]).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    } else {
      claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
      return this.http.post(claimsURL, parameters[1]).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }

  /* Function to get Provider TINS of Health System - Ranjith kumar Ankam */
  public getTins(providerKey) {
    const params = new HttpParams();
    const tinsURL = this.APP_URL + this.TINS_SERVICE_PATH + providerKey;

    return this.http.get(tinsURL, { params: params }).pipe(
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
    return this.http.get(piURL, { params: params }).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }

  public getPaymentData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    if (parameters[1]['ClaimsBy'] === 'DateOfProcessing') {
      const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH_DOP + parameters[0] + '?requestType=PROVIDER';
      return combineLatest(
        this.http.post(claimsURL, parameters[1]).pipe(
          map(res => JSON.parse(JSON.stringify(res))),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        ),
        // this.claimsAppealsData(...parameters)
        this.getPaymentsData(parameters)
      );
    } else {
      const nonPaymentURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
      return this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }

  public getAppealsWrapperData(parameters) {
    const appURL = this.APP_URL + this.APEEALS_FHIR_API_PATH + parameters[0];
    const appealsParams = parameters[1];
    if (!appealsParams.TimeFilter) {
      appealsParams.TimeFilter = parameters.TimeFilter;
    }
    return this.http.post(appURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
