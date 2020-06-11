import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {
  private APP_URL: string = environment.apiProxyUrl;
  private SERVICE_PATH: string = environment.apiUrls.BusinessGlossary;
  private KOP_SERVICE_PATH: string = environment.apiUrls.KOPBusinessGlossary;
  constructor(private http: HttpClient) {}

  public getBusinessGlossaryDataAsync(params: any): Promise<any> {
    const { kop } = params;
    const url = this.APP_URL + (kop ? this.KOP_SERVICE_PATH : this.SERVICE_PATH);
    return this.http.get(url).toPromise();
  }
}
