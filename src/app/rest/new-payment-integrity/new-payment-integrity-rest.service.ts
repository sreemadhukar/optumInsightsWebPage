import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPaymentIntegrityServiceRest {
  public APP_URL: string = environment.apiProxyUrl;
  public currentUser: any;
  // private SERVICE_PATH: string = environment.apiUrls.PaymentIntegrityTabsInfo;
  private SERVICE_PATH = 'payment-integrity/';
  private internalUser: boolean = environment.internalAccess;
  constructor(private http: HttpClient) {}
  public getNewPaymentIntegrityData(date: any) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const providerKey = this.currentUser[0].ProviderKey;
    const params = new HttpParams();
    const urlDates = '?periodStart=' + date.StartDate + '&' + 'periodEnd=' + date.EndDate;
    const url = this.APP_URL + this.SERVICE_PATH + providerKey + urlDates;
    return this.http.get(url, { params }).pipe(
      map(res => {
        return JSON.parse(JSON.stringify(res))[0];
      }),
      catchError(err => of(err))
    );
  }
}
