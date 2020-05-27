import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsService {
  private APP_URL: string = environment.apiProxyUrl;
  private SMART_EDITS_SERVICE_PATH: string = environment.apiUrls.SmartEdits;

  constructor(private http: HttpClient) {
    this.getSmartEditTopReasons().subscribe(data => {
      console.log('17data', data);
    });
  }

  public smartEditReturned(parameters) {
    //  const smartEditParams = parameters[1];

    const smartEditParams = {
      TimeFilter: 'Rolling3Months'
    };

    const smartEditURL = this.APP_URL + this.SMART_EDITS_SERVICE_PATH + parameters[0];
    return this.http.post(smartEditURL, smartEditParams).pipe(
      map(res => JSON.parse(JSON.stringify(res))),
      catchError(err => of(JSON.parse(JSON.stringify(err))))
    );
  }

  public getSmartEditTopReasons(): Observable<any> {
    return this.http.get('./src/assets/mock-data/smart-edits.json');
  }
}
