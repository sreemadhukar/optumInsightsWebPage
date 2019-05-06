/* @author Sparsh Kumar */
import { Injectable } from '@angular/core';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: CareDeliveryPageModule
})
export class PriorAuthService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private PRIOR_AUTHORIZATION_SERVICE_PATH: string = environment.apiUrls.PriorAuth;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  constructor(private http: HttpClient) {}

  public getPriorAuthData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    let paparams = new HttpParams();
    if (parameters[1]) {
      paparams = paparams.append('rolling12', parameters[1]);
    }

    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    const priorAuthURL = this.APP_URL + this.PRIOR_AUTHORIZATION_SERVICE_PATH + parameters[0];

    return this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
      retry(2),
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
    /*
    return combineLatest(
      this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.post(priorAuthURL, paparams, { headers: myHeader }).pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
    */
  }
}
