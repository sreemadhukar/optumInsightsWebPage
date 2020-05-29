/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.ProviderList;
  constructor(private http: HttpClient) {}

  public getProvidersData(text) {
    const params = new HttpParams();
    const url = this.APP_URL + this.SERVICE_PATH + '?providerName=' + text;
    return this.http.post(url, params).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
