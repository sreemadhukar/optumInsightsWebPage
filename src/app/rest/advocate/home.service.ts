import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUserResponse } from '../../components/advocate/advocate-home/user.class';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  readonly APP_URL: string = environment.apiProxyUrl;
  constructor(private http: HttpClient) {}

  search(
    filter: { searchValue: string; searchType: string } = { searchValue: '', searchType: 'hco' }
  ): Observable<IUserResponse[]> {
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
