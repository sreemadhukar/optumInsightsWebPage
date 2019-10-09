/* @author gmounika */
import { Injectable } from '@angular/core';
import { AdvocateModule } from '../../components/advocate/advocate.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewAdvocateService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private APPEALS_SERVICE_PATH: string = environment.apiUrls.Appeals;
  private APPEALS_TREND_SERVICE_PATH: string = environment.apiUrls.AppealsTrend;

  constructor(private http: HttpClient) {}

  public appealsData(...parameters) {
    const appealsParams = parameters[1];
    if (!appealsParams.Tin) {
      appealsParams.AllProviderTins = true;
    }

    const appealsURL = this.APP_URL + this.APPEALS_SERVICE_PATH + parameters[0];
    return this.http.post(appealsURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public appealsDataTrendByMonth(...parameters) {
    const appealsParams = parameters[1];
    if (!appealsParams.Tin) {
      appealsParams.AllProviderTins = true;
    }
    const appealsURL = this.APP_URL + this.APPEALS_TREND_SERVICE_PATH + parameters[0];
    return this.http.post(appealsURL, appealsParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
