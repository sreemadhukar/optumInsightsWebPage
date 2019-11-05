import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KopInsightsRestService {
  constructor(private http: HttpClient) {}
  public getKopData() {
    return this.http.get('./src/assets/mock-data/kop-insights.json');
  }
}
