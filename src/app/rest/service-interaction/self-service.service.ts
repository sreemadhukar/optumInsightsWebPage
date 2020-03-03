import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { map, catchError, retry } from 'rxjs/operators';
import { combineLatest, of, Observable } from 'rxjs';
import { ISelfService, ISelfService2 } from '../../modals/i-self-service';
@Injectable({ providedIn: ServiceInteractionModule })
export class SelfServiceService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  constructor(private http: HttpClient) {}

  public getSelfServiceData(...parameters): Observable<any[]> {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });

    let eparams = new HttpParams();
    let ediparams = {};
    let pprparams = {};
    ediparams = {
      ClaimsBy: 'DOS',
      appealsProcessing: 'Received Date',
      TimeFilter: 'Last6Months',
      submissionTypes: ['EDI']
    };
    pprparams = {
      ClaimsBy: 'DOS',
      appealsProcessing: 'Received Date',
      TimeFilter: 'Last6Months',
      submissionTypes: ['PAPER']
    };
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    return combineLatest(
      this.http.get(executiveURL, { params: eparams, headers: myHeader }).pipe(
        map(res => res),
        retry(2),
        catchError(err => of(err))
      ),
      this.http.post(claimsURL, ediparams).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.post(claimsURL, pprparams).pipe(
        map(res => JSON.parse(JSON.stringify(res[0]))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }
}
