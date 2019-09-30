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
  private SERVICE_PATH: string = environment.apiUrls.NPSSummary;
  constructor(private http: HttpClient) {}

  public getSummary({ params }) {
    const url = this.APP_URL + this.SERVICE_PATH;
    return this.http.get(url, { params }).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
