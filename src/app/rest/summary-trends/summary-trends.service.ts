import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SummaryTrendsService {
  private APP_URL: string = environment.apiProxyUrl;
  private ADMIN_SUMMARY_TRENDS: string = environment.apiUrls.AdminSummaryTrends;

  constructor(private http: HttpClient) {}

  public summaryTrendsData(params) {
    // const metric = params.metricName;
    // const searchDate = params.searchDate;
    const URL = this.APP_URL + this.ADMIN_SUMMARY_TRENDS;
    return this.http.post(URL, params).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
