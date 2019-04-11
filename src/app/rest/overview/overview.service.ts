/* @author gmounika */
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { map, retry, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
@Injectable({ providedIn: OverviewPageModule })
export class OverviewService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string;
  constructor(private http: HttpClient) {
    this.combined = combineLatest(
      this.http.get('../../../src/assets/mock-data/providersystemss.json').pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      ),
      this.http.get('../../../src/assets/mock-data/claims.json').pipe(
        retry(2),
        map(res => JSON.parse(JSON.stringify(res))),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      )
    );
  }

  public getOverviewData() {
    // this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    // this.authBearer = this.currentUser[0].PedAccessToken;
    this.SERVICE_PATH = environment.apiUrls.ProviderSystemClaimsAgg;
    const myInsights: any = {};
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      Accept: '*/*'
    });
    const opts = { headers: myHeader };
    const params = new HttpParams();
    const url = this.APP_URL + this.SERVICE_PATH;

    return this.http.post(url, params, { headers: myHeader }).pipe(
      map(OverviewData => {
        return OverviewData;
      })
    );
  }
}
