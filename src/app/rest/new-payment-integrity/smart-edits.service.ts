import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsService {
  private APP_URL: string = environment.apiProxyUrl;
  private SMART_EDITS_SERVICE_PATH: string = environment.apiUrls.SmartEdits;
  private SMART_EDITS_Claims_SERVICE_PATH: string = environment.apiUrls.SmartEditsTopClaims;

  constructor(private http: HttpClient) {
    // this.getSmartEditTopReasons().subscribe(data => {
    //   console.log('17data', data);
    // });
  }

  public smartEditReturned(parameters) {
    //  const smartEditParams = parameters[1].TimeFilter;

    const smartEditParams = {
      TimeFilter: parameters[1].TimeFilter
    };
    // const params = new HttpParams();
    // const smartEditParams = params.append('TimeFilter', parameters[1].TimeFilter);

    const smartEditURL = this.APP_URL + this.SMART_EDITS_SERVICE_PATH + parameters[0];
    return this.http.post(smartEditURL, smartEditParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getSmartEditTopReasons(parameters) {
    const smartEditParams = {
      TimeFilter: parameters[1].TimeFilter
    };
    const smartEditClaimsurl = this.APP_URL + this.SMART_EDITS_Claims_SERVICE_PATH + parameters[0];
    return this.http.post(smartEditClaimsurl, smartEditParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
