/* @author Sparsh Kumar */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriorAuthService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.PriorAuth;
  constructor(private http: HttpClient) {}

  getPriorAuthDataNew(parameters, requestBody) {
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

    return this.http.post(url, requestBody, { params: params }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
