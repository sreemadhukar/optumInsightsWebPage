import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NPSService {
  constructor(private http: HttpClient) {}
  public getNPSSummary() {
    return this.http.get('./src/assets/mock-data/nps.json');
  }
}
