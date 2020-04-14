import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PcorService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private PCOR_SERVICE_PATH: string = environment.apiUrls.PCORQualityMeasure;
  constructor(private http: HttpClient) {}

  /** The following service method is fetching data for
   * 1. Medicare Average Star Rating
   * 2. Medicare Annual Care Visits Completion Rate
   * 3. Quality Star top level information i.e. star count only
   */

  public getExecutiveData(...parameters) {
    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];

    return this.http.get(executiveURL, { params: eparams }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      retry(2),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  /** The following service method is fetching data for
   * 3. Data corresponding to the Quality Star
   *  i.e. the inside level information for the quality star i.e. subCategories
   */

  public getPCORMedicareData(...parameters) {
    const params = new HttpParams();

    const PCORQualityMeasureURL = this.APP_URL + this.PCOR_SERVICE_PATH + parameters[0];
    return this.http.get(PCORQualityMeasureURL, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      retry(2),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
  public getPCORQualityMeasureData(...parameters) {
    const params = new HttpParams();

    const PCORQualityMeasureURL = this.APP_URL + this.PCOR_SERVICE_PATH + parameters[0];
    return this.http.get(PCORQualityMeasureURL, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
