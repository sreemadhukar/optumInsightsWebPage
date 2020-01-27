import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NonPaymentTopClaimsService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.NonPaymentTopClaims;
  constructor(private http: HttpClient) {}

  public getViewTopClaimsData(parameters, requestBody) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    // Sample template
    const requestBodyTemplate = {
      tins: null,
      periodStart: null,
      periodEnd: null,
      reason: true,
      subReason: true,
      taxIdOwnership: null,
      requestType: null
    };
    const params = new HttpParams();
    const topClaimsUrl = this.APP_URL + this.SERVICE_PATH + parameters[0];
    console.log('topClaimsUrl', topClaimsUrl);
    return this.http.post(topClaimsUrl, { params, headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
