import { Injectable } from '@angular/core';
import { combineLatest, of, Observable } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IRlpApiResponse } from '../../modals/i-rlp';
import { rlpPageName, endpointsTIN, endpointsHCO } from '../../modals/rlp-data';

export const mapReqTypeWithAPI = {
  hco: [
    { name: rlpPageName.Referral, apiEndPoint: endpointsHCO.referral },
    { name: rlpPageName.Labs, apiEndPoint: endpointsHCO.labs },
    { name: rlpPageName.Perscription, apiEndPoint: endpointsHCO.perscription }
  ],
  tin: [
    { name: rlpPageName.Referral, apiEndPoint: endpointsTIN.referral },
    { name: rlpPageName.Labs, apiEndPoint: endpointsTIN.labs },
    { name: rlpPageName.Perscription, apiEndPoint: endpointsTIN.perscription }
  ]
};
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
   * @param pageName  Request Type which will be sent alongwith with API url as an endPoint
   * @param requestType  Request Type will be two only, 'hco' or 'tin'
   * @param requestBody paramter of Request Body
   */

  public getNetworkLeversData(
    providerSyskey,
    pageName: string,
    requestType: string,
    requestBody
  ): Observable<IRlpApiResponse[]> {
    const type = requestType;
    const endPoint = mapReqTypeWithAPI[type].find(item => item.name === pageName).apiEndPoint;
    const URL = this.APP_URL + this.NETWORK_LEVER_PATH + providerSyskey + '?requestType=' + endPoint;
    return this.http.post(URL, requestBody).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }

  public getAllHcoRlp(providerSyskey, requestBody): Observable<any> {
    const rlpUrl = this.APP_URL + this.NETWORK_LEVER_PATH + providerSyskey + '?requestType=';
    const getAllEndPoints = mapReqTypeWithAPI.hco.map(item => this.http.post(rlpUrl + item.apiEndPoint, requestBody));
    console.log(getAllEndPoints);
    return combineLatest(getAllEndPoints);
  }
}
