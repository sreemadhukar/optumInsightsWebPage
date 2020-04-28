import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CallsService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CALLS_API: string = environment.apiUrls.CallsTrend;
  constructor(private http: HttpClient) {}

  /*
  public getCallsTrendData(...parameters) {

    const params = new HttpParams();
    const prevLastURL = this.APP_URL + this.CALLS_TREND_PATH + parameters[0] + '?TimeFilter=' + parameters[1];
    const lastURL = this.APP_URL + this.CALLS_TREND_PATH + parameters[0] + '?TimeFilter=' + parameters[2];
    return combineLatest(
      this.http.get(prevLastURL, { params }).pipe(
        map(res => res),
        catchError(err => of(err))
      ),
      this.http.get(lastURL, { params }).pipe(
        map(res => res),
        catchError(err => of(err))
      )
    );
  }
*/

  public getCallsData(...parameters): Observable<any> {
    let params = new HttpParams();
    if (parameters[1].TimeFilter === 'CalendarYear') {
      params = params.append('time-filter', parameters[1].TimeFilter);
      params = params.append('time-filter-text', parameters[1].TimeFilterText);
    } else {
      params = params.append('timeilter', parameters[1].TimeFilter);
    }
    const executiveURL = this.APP_URL + this.CALLS_API + parameters[0];

    return this.http.get(executiveURL, { params }).pipe(
      map(res => res),
      retry(2),
      catchError(err => {
        throw err;
      })
    );
  }
}
