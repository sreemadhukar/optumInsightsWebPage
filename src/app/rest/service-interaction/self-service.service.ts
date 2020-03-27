import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { map, catchError, retry } from 'rxjs/operators';
import { combineLatest, of, Observable } from 'rxjs';
@Injectable({ providedIn: ServiceInteractionModule })
export class SelfServiceService {
  public combined: any;
  private APP_URL: string = environment.apiProxyUrl;
  private EXECUTIVE_SERVICE_PATH: string = environment.apiUrls.ExecutiveSummaryPath;
  private CLAIMS_SERVICE_PATH: string = environment.apiUrls.ProviderSystemClaimsSummary;
  constructor(private http: HttpClient) {}

  public getSelfServiceData(...parameters): Observable<any[]> {
    let eparams = new HttpParams();
    let ediparams = {};
    let pprparams = {};
    ediparams = {
      TimeFilter: 'Last6Months',
      submissionTypes: ['EDI']
    };
    pprparams = {
      TimeFilter: 'Last6Months',
      submissionTypes: ['PAPER']
    };
    eparams = eparams.append('filter', 'executive');

    const executiveURL = this.APP_URL + this.EXECUTIVE_SERVICE_PATH + parameters[0];
    const claimsURL = this.APP_URL + this.CLAIMS_SERVICE_PATH + parameters[0] + '?requestType=PAYMENT_METRICS';
    return combineLatest(
      this.http.get(executiveURL, { params: eparams }).pipe(
        map(res => res),
        retry(2),
        catchError(err => of(err))
      ),
      this.http.post(claimsURL, ediparams).pipe(
        map(res => res[0]),
        catchError(err => of(err))
      ),
      this.http.post(claimsURL, pprparams).pipe(
        map(res => res[0]),
        catchError(err => of(err))
      )
    );
  }
}
