import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUserResponse, IAdvTinDetailsResponse } from '../../components/advocate/advocate-home/user.class';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  readonly APP_URL: string = environment.apiProxyUrl;
  readonly PROVIDER_SEARCH_PATH: string = environment.apiUrls.ProviderSearch;
  readonly ADVOCATE_TIN_PATH: string = environment.apiUrls.AdvocateTinDetails;
  constructor(private http: HttpClient) {}

  search(filter: { searchValue: string; searchType: string }): Observable<IUserResponse[]> {
    const myparam = new HttpParams();
    const searchURL =
      this.APP_URL +
      this.PROVIDER_SEARCH_PATH +
      '?search-type=' +
      filter.searchType +
      '&search-value=' +
      filter.searchValue;
    return this.http.get<IUserResponse[]>(searchURL, { params: myparam }).pipe(
      map((response: IUserResponse) => response),
      catchError(err => err)
    );
  }
  getAdvDetails(param: string): Observable<IAdvTinDetailsResponse[]> {
    const myparam = new HttpParams();
    const searchURL = this.APP_URL + this.ADVOCATE_TIN_PATH + param;
    return this.http
      .get<IAdvTinDetailsResponse[]>(searchURL, { params: myparam })
      .pipe(
        map((response: IAdvTinDetailsResponse) => response),
        catchError(err => err)
      );
  }
}
