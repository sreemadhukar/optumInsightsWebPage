import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPremiumDesignationService {
  public currentUser: any;
  public APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.GroupPremiumDesignation;
  private internalUser: boolean = environment.internalAccess;
  constructor(private http: HttpClient) {}
  public groupPremiumDesignationData() {
    if (environment.apiUrls.GroupPremiumDesignation && this.internalUser) {
      if (JSON.parse(sessionStorage.getItem('currentUser'))) {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const providerKey = this.currentUser[0].ProviderKey;
        const params = new HttpParams();
        const url = this.APP_URL + this.SERVICE_PATH + providerKey;
        return this.http.get(url, { params }).pipe(
          map(res => JSON.parse(JSON.stringify(res))),
          catchError(err => of(err))
        );
      }
    } else {
      return null;
    }
  }
}
