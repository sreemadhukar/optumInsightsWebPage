import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KopService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH_KOP: string = environment.apiUrls.NPSSummary;
  private SERVICE_PATH_KOP_QUARTERLY: string = environment.apiUrls.NPSQuarterlySummary;
  private SERVICE_PATH_KOP_PRIORAUTH_TAT: string = environment.apiUrls.KOPPriorAuthSummary;
  private SERVICE_PATH_KOP_CLAIMS: string = environment.apiUrls.KOPReimbursementClaims;
  constructor(private http: HttpClient) {}

  public getNpsDetailSummary({ params }) {
    const url = this.APP_URL + this.SERVICE_PATH_KOP_QUARTERLY;
    return this.http.get(url, { params });
  }
  public getSummary({ params }) {
    const url = this.APP_URL + this.SERVICE_PATH_KOP;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getPriorAuthTATSummary({ params }) {
    const url = this.APP_URL + this.SERVICE_PATH_KOP_PRIORAUTH_TAT;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getClaimsData({ params }) {
    const url = this.APP_URL + this.SERVICE_PATH_KOP_CLAIMS;
    return this.http.post(url, params).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
