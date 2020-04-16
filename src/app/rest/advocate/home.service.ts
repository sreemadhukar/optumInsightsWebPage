import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { IUserResponse } from '../../components/advocate/advocate-home/user.class';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private APP_URL: string = environment.apiProxyUrl;
  private authBearer: any;
  private currentUser: any;
  constructor(private http: HttpClient) {}

  search(
    filter: { searchValue: string; searchType: string } = { searchValue: '', searchType: 'hco' }
  ): Observable<IUserResponse[]> {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    // const myHeader = new HttpHeaders({
    //   Authorization: 'Bearer ' + this.authBearer,
    //   'Content-Type': 'application/json',
    //   Accept: '*/*'
    // });
    const myparam = new HttpParams();
    const searchURL =
      this.APP_URL + 'provider-search?search-type=' + filter.searchType + '&search-value=' + filter.searchValue;
    return this.http
      .get<IUserResponse[]>(searchURL, { params: myparam })
      .pipe(
        map((response: IUserResponse) => response),
        catchError(err => err)
      );
  }
}
