import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopRowAdvOverviewService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  private CLAIMS_SERVICE_PATH_DOP: string = environment.apiUrls.NonPaymentDop;
  constructor(private http: HttpClient) {}

  public getPaymentData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    const nonPaymentURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    return this.http.post(nonPaymentURL, parameters[1], { headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getPaymentsData(parameters) {
    let claimsURL;
    if (parameters[1]['ClaimsBy'] === 'DOP') {
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
}
