import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs/index';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthSystemDetailsService {
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private HEALTH_SYSTEM_PATH: string = environment.apiUrls.HealthSystemDetails;

  constructor(private http: HttpClient) {}

  public getHealthSystemData(parameters) {
    let params = new HttpParams();
    if (parameters) {
      params = params.append('providerSysKey', parameters);
    }
    const URL = this.APP_URL + this.HEALTH_SYSTEM_PATH;
    return this.http.get(URL, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
