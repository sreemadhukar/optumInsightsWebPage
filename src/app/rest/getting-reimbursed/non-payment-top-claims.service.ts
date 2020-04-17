import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NonPaymentTopClaimsService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.NonPaymentTopClaims;
  constructor(private http: HttpClient) {}

  public getViewTopClaimsData(parameters, requestBody) {
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

    return this.http.post(topClaimsUrl, requestBody, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
