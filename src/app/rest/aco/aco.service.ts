/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcoService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private ACOMetrics_SERVICE_PATH: string = environment.apiUrls.ACOMetrics;
  private AcoId: string;
  constructor(private http: HttpClient) {}
  public getAcoData() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.AcoId = this.currentUser[0]['AcoId'] ? this.currentUser[0]['AcoId'] : 'BRTO160120';
    const acoURL = this.APP_URL + this.ACOMetrics_SERVICE_PATH + this.AcoId + '?requestType=ACO_COST_OF_CARE_METRICS';

    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    return this.http.post(acoURL, { headers: myHeader }).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }
}
