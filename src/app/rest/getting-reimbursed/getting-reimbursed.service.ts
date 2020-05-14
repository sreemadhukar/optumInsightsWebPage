/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { get as _get } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GettingReimbursedService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private CLAIMS_SERVICE_PATH_DOP: string = environment.apiUrls.NonPaymentDop;
  // private AGG_CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsAgg;
  // private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals; // old
  private APPEALS_SERVICE: string = environment.apiUrls.AppealsFHIR; // new
  private APPEALS_OVERTURN: string = environment.apiUrls.AppealsOverturn;
  private TINS_SERVICE_PATH: string = environment.apiUrls.ProvTinList;
  private PAYMENT_INTEGRITY_PATH: string = environment.apiUrls.PaymentIntegrity;
  private APEEALS_FHIR_API_PATH: string = environment.apiUrls.AppealsFHIR;

  constructor(private http: HttpClient) {}
  public getGettingReimbursedYearWiseData(...parameters) {
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?request-type=PAYMENT_METRICS';
    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
        map((res: any) => {
          if (res.Data == null) {
            return null;
          } else {
            return res.Data[0];
          }
        }),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.claimsAppealsData(...parameters)
    );
  }

  /** function for Appeals PDP api */
  public claimsAppealsData(...parameters) {
    // const appealsParam = parameters[1];
    const appealsParam: any = JSON.parse(JSON.stringify(parameters[1]));
    /*REMOVING LOB BECAUSE TO SHOW GREY IN DONUT CHARTS*/
    if (appealsParam.Lob) {
      delete appealsParam.Lob;
    }
    if (appealsParam.FundingTypeCodes) {
      delete appealsParam.FundingTypeCodes;
    }
    /*SEE ABOVE*/
    let appealsReqType = '';
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsReqType = '?request-type=APPEALS_MEASURE_DOR_HCO';
    } else {
      appealsReqType = '?request-type=APPEALS_MEASURE_DOC_HCO';
    }
    const appealsURL = this.APP_URL + this.APPEALS_SERVICE + parameters[0] + appealsReqType;
    return this.http.post(appealsURL, appealsParam).pipe(
      map(res => {
        let dataValue = _get(res, ['Data', '0'], []);
        dataValue = dataValue.length ? dataValue : { Status: 404 };
        return dataValue;
      }),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public claimsAppealsReasonData(...parameters) {
    const appealsParam = parameters[1];
    let appealsReqType = '';
    if (appealsParam.FundingTypeCodes) {
      delete appealsParam.FundingTypeCodes;
    }
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsReqType = '?request-type=APPEALS_TOP_OVERTURNED_REASON_DOR_HCO';
    } else {
      appealsReqType = '?request-type=APPEALS_TOP_OVERTURNED_REASON_DOC_HCO';
    }
    const appealsURL = this.APP_URL + this.APPEALS_OVERTURN + parameters[0] + appealsReqType;
    return this.http.post(appealsURL, appealsParam).pipe(
      map(res => {
        let dataValue = _get(res, ['Data', '0'], []);
        dataValue = dataValue.length ? dataValue : { Status: 404 };
        return dataValue;
      }),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
  /** ----------------------------- */

  public getGettingReimbursedData(...parameters) {
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?request-type=PAYMENT_METRICS';
    return combineLatest(
      this.http.post(claimsURL, parameters[1]).pipe(
        map((res: any) => {
          if (res.Data == null) {
            return null;
          } else {
            return res.Data[0];
          }
        }),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.claimsAppealsData(...parameters)
    );
  }

  public getPaymentsData(parameters) {
    const par: any = JSON.parse(JSON.stringify(parameters[1]));
    /*REMOVING LOB BECAUSE TO SHOW GREY IN DONUT CHARTS*/
    if (par.Lob) {
      delete par.Lob;
    }
    /*SEE ABOVE*/

    let claimsURL;
    if (par['ClaimsBy'] === 'DOP') {
      claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH_DOP + parameters[0] + '?request-type=CLAIMS';
      return this.http.post(claimsURL, par).pipe(
        map((res: any) => res.Data),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    } else {
      claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?request-type=PAYMENT_METRICS';
      return this.http.post(claimsURL, par).pipe(
        map((res: any) => {
          if (res.Data == null) {
            return null;
          } else {
            return res.Data[0];
          }
        }),
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
    if (parameters[1]['ClaimsBy'] === 'DOP') {
      const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH_DOP + parameters[0] + '?request-type=PROVIDER';
      return combineLatest(
        this.http.post(claimsURL, parameters[1]).pipe(
          map((res: any) => res.Data),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        ),
        // this.claimsAppealsData(...parameters)
        this.getPaymentsData(parameters)
      );
    } else {
      const nonPaymentURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?request-type=PAYMENT_METRICS';
      return this.http.post(nonPaymentURL, parameters[1]).pipe(
        map((res: any) => {
          if (res.Data == null) {
            return null;
          } else {
            return res.Data[0];
          }
        }),
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

  public getTatDataforDOP(parameters) {
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH_DOP + parameters[0] + '?request-type=TAT';
    return this.http.post(claimsURL, parameters[1]).pipe(
      map((res: any) => res.Data),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
