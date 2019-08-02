import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({ providedIn: ServiceInteractionModule })
export class SelfServiceService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  constructor(private http: HttpClient) {}

  public getSelfServiceData(...parameters) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    let eparams = new HttpParams();
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    return combineLatest(
      this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
        map(res => res),
        catchError(err => of(err))
      )
    );
  }
}
