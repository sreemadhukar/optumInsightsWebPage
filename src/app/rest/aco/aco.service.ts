/* @author gmounika */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcoService {
  public currentUser: any;
  public combined: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;

  constructor(private http: HttpClient) {}
  public getAcoData() {
    const acoURL = './../../src/assets/mock-data/aco.json';
    const params = new HttpParams();

    return this.http.get(acoURL).pipe(
      map(res => res),
      catchError(err => of(err))
    );
  }
}
