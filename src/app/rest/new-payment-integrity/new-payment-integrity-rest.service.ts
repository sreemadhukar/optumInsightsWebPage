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
  private SERVICE_PATH: string = environment.apiUrls.NewPaymentIntegrity;
  constructor(private http: HttpClient) {}
  public getNewPaymentIntegrityData(date: any) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const providerKey = this.currentUser[0].ProviderKey;
    const params = new HttpParams();
    // console.log(date);
    // date.StartDate = "2020-07"; // for testing
    // date.EndDate = "2020-09";
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
