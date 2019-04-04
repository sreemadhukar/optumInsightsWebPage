/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: OverviewPageModule })
export class OverviewService {
  public currentUser: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string;
  constructor(private http: HttpClient) {}

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
        console.log(OverviewData);
        return OverviewData;
      })
    );
  }
}
