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
  getViewTopClaimsData(parameters, requestBody) {
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
    const url = this.APP_URL + this.SERVICE_PATH + parameters[0];
    const params = new HttpParams();
    // params = params.append('providerSysKey', parameters[1]);
    return this.http.post(url, requestBody, { headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
