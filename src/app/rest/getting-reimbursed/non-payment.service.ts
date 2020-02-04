import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonPaymentService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private NON_PAYMENT: string = environment.apiUrls.NonPayment;
  private NON_PAYMENT_DOP: string = environment.apiUrls.NonPaymentDop;

  constructor(private http: HttpClient) {}
  public getNonPaymentData(...parameters) {
    let nonPaymentURL;
    if (parameters[1]['ClaimsBy'] === 'DOP') {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT_DOP + parameters[0] + '?requestType=CLAIMS';
      return this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    } else {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0] + '?requestType=PAYMENT_METRICS';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
          map(res => JSON.parse(JSON.stringify(res[0]))),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    }
  }
  public getNonPaymentTopCategories(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    let nonPaymentUrl = this.NON_PAYMENT;
    let nonPaymentURL;
    if (parameters[1]['ClaimsBy'] === 'DOP') {
      nonPaymentUrl = this.NON_PAYMENT_DOP;
      parameters[1].reportType = 'subject';
      nonPaymentURL = this.APP_URL + nonPaymentUrl + parameters[0] + '?requestType=TOP_DENIAL_REASONS';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
          map(res => JSON.parse(JSON.stringify(res))),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    } else {
      nonPaymentURL = this.APP_URL + nonPaymentUrl + parameters[0] + '?requestType=NONPAYMENT_TOPCATEGORIES';
      return combineLatest(
        this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
          map(res => JSON.parse(JSON.stringify(res[0]))),
          catchError(err => of(JSON.parse(JSON.stringify(err))))
        )
      );
    }
  }

  public getNonPaymentSubCategories(parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    let nonPaymentURL;
    // console.log('Parameters', parameters);
    if (parameters[0][1]['ClaimsBy'] === 'DOP') {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT_DOP + parameters[0][0] + '?requestType=TOP_SUB_DENIAL_REASONS';
      const apiCall = parameters.map(param => this.http.post(nonPaymentURL, param[1], { headers: myHeader }));
      console.log(apiCall);
      return combineLatest(apiCall);
    } else {
      nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0][0] + '?requestType=NONPAYMENT_TOPSUBCATEGORIES';
      const apiCall = parameters.map(param => this.http.post(nonPaymentURL, param[1], { headers: myHeader }));
      console.log(apiCall);
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
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    const nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0][0] + '?requestType=NONPAYMENT_BYMONTH';
    return combineLatest(
      this.http.post(nonPaymentURL, parameters[0][1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
}
