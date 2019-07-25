import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class TrendingMetricsService {
  public currentUser: any;
  private APP_URL: string = environment.apiProxyUrl;
  private TRENDING_METRICS_PATH: string = environment.apiUrls.TrendingMetrics;
  constructor(private http: HttpClient) {}

  getTrendingMetrics(parameters) {
    const trendsURL = this.APP_URL + this.TRENDING_METRICS_PATH + parameters[0];

    return this.http.get(trendsURL).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
