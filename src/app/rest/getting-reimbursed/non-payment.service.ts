import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonPaymentService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private NON_PAYMENT: string = environment.apiUrls.NonPayment;
  private NON_PAYMENT_DOP: string = environment.apiUrls.NonPaymentDop;
  private NON_PAYMENT_TREND_DOP: string = environment.apiUrls.NonPaymentDopTrend;
  constructor(private http: HttpClient) {}
  public getNonPaymentData(...parameters) {
    let nonPaymentURL;
    if (parameters[1]['ClaimsBy'] === 'DOP') {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT_DOP + parameters[0] + '?requestType=CLAIMS';
      return this.http.post(nonPaymentURL, parameters[1]).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    } else {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0] + '?request-type=PAYMENT_METRICS';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1]).pipe(
          map((res: any) => {
            if (res.Data == null) {
              return null;
            } else {
              return res.Data[0];
            }
          }),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    }
  }
  public getNonPaymentTopCategories(...parameters) {
    let nonPaymentUrl = this.NON_PAYMENT;
    let nonPaymentURL;
    if (parameters[1]['ClaimsBy'] === 'DOP') {
      nonPaymentUrl = this.NON_PAYMENT_DOP;
      parameters[1].reportType = 'subject';
      nonPaymentURL = this.APP_URL + nonPaymentUrl + parameters[0] + '?requestType=TOP_DENIAL_REASONS';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1]).pipe(
          map(res => JSON.parse(JSON.stringify(res))),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    } else {
      nonPaymentURL = this.APP_URL + nonPaymentUrl + parameters[0] + '?request-type=NONPAYMENT_TOPCATEGORIES';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1]).pipe(
          map((res: any) => {
            if (res.Data == null) {
              return null;
            } else {
              return res.Data[0];
            }
          }),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    }
  }

  public getNonPaymentSubCategories(parameters) {
    let nonPaymentURL;
    if (parameters[0][1]['ClaimsBy'] === 'DOP') {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT_DOP + parameters[0][0] + '?requestType=TOP_SUB_DENIAL_REASONS';
      const apiCall = parameters.map(param => this.http.post(nonPaymentURL, param[1]));
      return combineLatest(apiCall);
    } else {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0][0] + '?request-type=NONPAYMENT_TOPSUBCATEGORIES';
      const apiCall = parameters.map(param => this.http.post(nonPaymentURL, param[1]));
      return combineLatest(apiCall);
    }
    // return combineLatest(
    //   this.http.post(nonPaymentURL, parameters[0][1], { headers: myHeader }).pipe(
    //     map(res => JSON.parse(JSON.stringify(res[0]))),
    //     catchError(err => of(JSON.parse(JSON.stringify(err))))
    //   ),
    //   this.http.post(nonPaymentURL, parameters[1][1], { headers: myHeader }).pipe(
    //     map(res => JSON.parse(JSON.stringify(res[0]))),
    //     catchError(err => of(JSON.parse(JSON.stringify(err))))
    //   ),
    //   this.http.post(nonPaymentURL, parameters[2][1], { headers: myHeader }).pipe(
    //     map(res => JSON.parse(JSON.stringify(res[0]))),
    //     catchError(err => of(JSON.parse(JSON.stringify(err))))
    //   ),
    //   this.http.post(nonPaymentURL, parameters[3][1], { headers: myHeader }).pipe(
    //     map(res => JSON.parse(JSON.stringify(res[0]))),
    //     catchError(err => of(JSON.parse(JSON.stringify(err))))
    //   ),
    //   this.http.post(nonPaymentURL, parameters[4][1], { headers: myHeader }).pipe(
    //     map(res => JSON.parse(JSON.stringify(res[0]))),
    //     catchError(err => of(JSON.parse(JSON.stringify(err))))
    //   )
    // );
  }

  public getNonPaymentTrendByMonth(...parameters) {
    if (parameters[0][1].ClaimsBy === 'DOP') {
      const nonPaymentURL = this.APP_URL + this.NON_PAYMENT_TREND_DOP + parameters[0][0];
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[0][1]).pipe(
          map(res => res),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    } else {
      const nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0][0] + '?request-type=NONPAYMENT_BYMONTH';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[0][1]).pipe(
          map((res: any) => {
            if (res.Data == null) {
              return null;
            } else {
              return res.Data[0];
            }
          }),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    }
  }
}
