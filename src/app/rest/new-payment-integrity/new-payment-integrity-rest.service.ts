import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPaymentIntegrityServiceRest {
  constructor(private http: HttpClient) {}
  public getNewPaymentIntegrityData() {
    return this.http.get('./src/assets/mock-data/new-payment-integrity.json');
  }
}
