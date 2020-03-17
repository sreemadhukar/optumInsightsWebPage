import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { combineLatest, of, Observable } from 'rxjs';
import { ICalls } from '../../modals/i-calls';
@Injectable({ providedIn: 'root' })
export class CallsService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CALLS_API: string = environment.apiUrls.CallsTrend;
  constructor(private http: HttpClient) {}

  /*
  public getCallsTrendData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;

    const params = new HttpParams();
    const prevLastURL = this.APP_URL + this.CALLS_TREND_PATH + parameters[0] + '?TimeFilter=' + parameters[1];
    const lastURL = this.APP_URL + this.CALLS_TREND_PATH + parameters[0] + '?TimeFilter=' + parameters[2];
    return combineLatest(
      this.http.get(prevLastURL, { params, headers: myHeader }).pipe(
        map(res => res),
        catchError(err => of(err))
      ),
      this.http.get(lastURL, { params, headers: myHeader }).pipe(
        map(res => res),
        catchError(err => of(err))
      )
    );
  }
*/

  public getCallsData(...parameters): Observable<ICalls[]> {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    let params = new HttpParams();
    if (parameters[1].TimeFilter === 'CalendarYear') {
      params = params.append('TimeFilter', parameters[1].TimeFilter);
      params = params.append('TimeFilterText', parameters[1].TimeFilterText);
    } else {
      params = params.append('TimeFilter', parameters[1].TimeFilter);
    }
    const executiveURL = this.APP_URL + this.CALLS_API + parameters[0];
    return combineLatest(
      this.http.get(executiveURL, { params, headers: myHeader }).pipe(
        map(res => res),
        retry(2),
        catchError(err => of(err))
      )
    );
  }
}
