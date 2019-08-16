import { Injectable } from '@angular/core';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientCareOpportunityService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private PCOR_SERVICE_PATH: string = environment.apiUrls.PCORQualityMeasure;
  constructor(private http: HttpClient) {}

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
