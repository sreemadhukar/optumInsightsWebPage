import { Injectable } from '@angular/core';
import { combineLatest, of, Observable } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IRlpApiResponse } from '../../modals/i-rlp';
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

  /**
   * getNetworkLeversData function handle the sorting of the table
   * @param providerSyskey  Provider sys key
   * @param requestType  Request Type which will be sent alongwith with API url as an endPoint
   * @param requestBody paramter of Request Body
   */

  public getNetworkLeversData(providerSyskey, requestType, requestBody): Observable<IRlpApiResponse[]> {
    const URL = this.APP_URL + this.NETWORK_LEVER_PATH + providerSyskey + '?requestType=' + requestType;
    console.log('URL-------------->', URL);
    return this.http.post(URL, requestBody).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }
}
