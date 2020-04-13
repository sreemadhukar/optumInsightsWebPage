import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User, IUserResponse } from '../../components/advocate/advocate-home/user.class';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private APP_URL: string = environment.apiProxyUrl;
  private authBearer: any;
  private currentUser: any;
  constructor(private http: HttpClient) {}

  search(filter: { name: string } = { name: '' }, page = 1): Observable<any> {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.authBearer = this.currentUser[0].PedAccessToken;
    const myHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.authBearer,
      'Content-Type': 'application/json',
      Accept: '*/*'
    });
    const searchURL = this.APP_URL + 'provider-search?search-type=hco&search-value=' + filter.name;
    console.log('search', searchURL);
    return this.http.get(searchURL, { headers: myHeader }).pipe(
      tap(response => {
        console.log('Respnse get', response);
        response = response.map(user => new User(user.BicId, user.Tin, user.TinName));
        // Not filtering in the server since in-memory-web-api has somewhat restricted api
        console.log('Search service', response);
        return response;
      })
    );
  }
}
