import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceRestService {
  private APP_URL: string = environment.apiProxyUrl;
  private NETWORK_LEVER_PATH: string = environment.apiUrls.NetworkLever;

  constructor(private http: HttpClient) {}
  public getPerformanceData() {
    return this.http.get('./src/assets/mock-data/performance.json');
  }

  public getNetworkLeversData(parameters) {
    let tparams = {};
    if (parameters) {
      tparams = {
        TimeFilter: 'YTD'
      };
    }
    const URL = this.APP_URL + this.NETWORK_LEVER_PATH + parameters[0] + parameters[1];
    console.log('URL-------------->', URL);
    return this.http.get(URL, { params: tparams }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
