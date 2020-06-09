import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsService {
  private readonly APP_URL: string = environment.apiProxyUrl;
  private readonly SMART_EDITS_SERVICE_PATH: string = environment.apiUrls.SmartEdits;
  private readonly SMART_EDITS_Claims_SERVICE_PATH: string = environment.apiUrls.SmartEditsTopClaims;

  constructor(private readonly http: HttpClient) {}

  public smartEditReturned(parameters: any) {
    const smartEditURL = this.APP_URL + this.SMART_EDITS_SERVICE_PATH + parameters[0];
    return this.http.post(smartEditURL, parameters[1]).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getSmartEditTopReasons(parameters: any) {
    const smartEditClaimsurl = this.APP_URL + this.SMART_EDITS_Claims_SERVICE_PATH + parameters[0];
    return this.http.post(smartEditClaimsurl, parameters[1]).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }
}
