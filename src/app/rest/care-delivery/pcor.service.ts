import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PcorService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private PCOR_SERVICE_PATH: string = environment.apiUrls.PCORQualityMeasure;
  constructor(private http: HttpClient) {}

  /** The following service method is fetching data for
   * 1. Medicare & Retirement Average Star Rating
   * 2. Medicare & Retirement Annual Care Visits Completion Rate
   * 3. Quality Star top level information i.e. star count only
   */

  public getExecutiveData(...parameters) {
    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];

    return this.http.get(executiveURL, { params: eparams }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  /** The following service method is fetching data for
   * 3. Data corresponding to the Quality Star
   *  i.e. the inside level information for the quality star i.e. subCategories
   */

  public getPCORQualityMeasureData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    const params = new HttpParams();

    const PCORQualityMeasureURL = this.APP_URL + this.PCOR_SERVICE_PATH + parameters[0];
    return this.http.get(PCORQualityMeasureURL, { params, headers: myHeader }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
