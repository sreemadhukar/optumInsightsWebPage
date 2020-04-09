import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentIntegrityTabInfoService {
  public APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.PaymentIntegrityTabsInfo;
  private internalUser: boolean = environment.internalAccess;
  constructor(private http: HttpClient) {}
  public tabInfo() {
    const params = new HttpParams();
    const url = this.APP_URL + this.SERVICE_PATH;
    return this.http.get(url, { params }).pipe(
      map(res => {
        return JSON.parse(JSON.stringify(res));
      }),
      catchError(err => of(err))
    );
  }
}
