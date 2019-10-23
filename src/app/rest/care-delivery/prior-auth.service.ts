/* @author Sparsh Kumar */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriorAuthService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.PriorAuth;
  constructor(private http: HttpClient) {}

  getPriorAuthDataNew(parameters, requestBody) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    // Sample template
    const requestBodyTemplate = {
      tin: null,
      lob: 'allLob',
      allNotApprovedSettings: true,
      decisionType: false,
      decisionValue: null,
      serviceCategory: false,
      serviceCategoryValue: null,
      timeFilter: 'last6Months',
      timeFilterText: null
    };

    const url = this.APP_URL + this.SERVICE_PATH + parameters[0];
    let params = new HttpParams();
    params = params.append('allProviderTins', parameters[1]);

    return this.http.post(url, requestBody, { headers: myHeader, params: params }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
