import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private toggleData: Object;
  private val: boolean;
  private jwtPath: string = environment.originUrl;

  constructor(public http: HttpClient) {}

  getToggles() {
    const url = 'src/assets/user-controls/authorise.json';
    const myHeader = new HttpHeaders();
    myHeader.set('Accept', '*/*');
    const params = new HttpParams();
    return this.http.get(url, { params }).pipe(
      map(data => {
        sessionStorage.setItem('toggles', JSON.stringify(data));
      })
    );
  }

  getHeac(param: string) {
    const url = this.jwtPath + 'api/getHeac/' + param;
    const myHeader = new HttpHeaders();
    myHeader.set('Accept', '*/*');
    const params = new HttpParams();
    return this.http.get(url, { params }).pipe(
      map(data => {
        sessionStorage.setItem('heac', JSON.stringify(data));
      })
    );
  }

  setToggles(tile: string, page: string, menu: string, isSummary?: boolean) {
    const object = JSON.parse(sessionStorage.getItem('toggles'));
    return isSummary ? object[menu]['Summary'][page][tile] : object[menu][page][tile];
  }

  setNavigationToggles(menu: string, page: string) {
    const object = JSON.parse(sessionStorage.getItem('toggles'));
    return object[menu].hasOwnProperty('navLink') ? object[menu]['navLink'] : object[menu][page]['navLink'];
  }
}
