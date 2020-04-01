import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.BusinessGlossary;
  private KOP_SERVICE_PATH: string = environment.apiUrls.KOPBusinessGlossary;
  constructor(private http: HttpClient) {}

  public getBusinessGlossaryData() {
    const params = new HttpParams();
    const url = this.APP_URL + this.SERVICE_PATH;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getGlossaryMetricID(metricID) {
    const params = new HttpParams();
    const url = this.APP_URL + 'business-glossaries' + '?metricId=' + metricID;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
  public getGlossaryByMetricName(metricName) {
    const params = new HttpParams();
    const url = this.APP_URL + 'business-glossaries' + '?metric=' + metricName;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getKOPGlossaryMetricID(metricID) {
    const params = new HttpParams();
    const url = this.APP_URL + 'business-glossaries-kop' + '?metricId=' + metricID;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res[0]))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getKOPBusinessGlossaryData() {
    const params = new HttpParams();
    const url = this.APP_URL + this.KOP_SERVICE_PATH;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
