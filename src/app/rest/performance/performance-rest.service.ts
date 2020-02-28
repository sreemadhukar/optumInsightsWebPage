import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerformanceRestService {
  constructor(private http: HttpClient) {}
  public getPerformanceData() {
    return this.http.get('./src/assets/mock-data/performance.json');
  }
}
