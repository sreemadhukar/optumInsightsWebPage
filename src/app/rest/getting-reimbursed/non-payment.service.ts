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
  constructor(private http: HttpClient) {}
  public getNonPaymentData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    const nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0] + '?requestType=NONPAYMENT_METRICS';
    return combineLatest(
      this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
  public getNonPaymentTopCategories(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    const nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0] + '?requestType=NONPAYMENT_TOPCATEGORIES';
    return combineLatest(
      this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }

  public getNonPaymentSubCategories(parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    console.log('Parmaters', parameters);
    const nonPaymentURL = this.APP_URL + this.NON_PAYMENT + parameters[0] + '?requestType=NONPAYMENT_TOPSUBCATEGORIES';
    return combineLatest(
      this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
}
