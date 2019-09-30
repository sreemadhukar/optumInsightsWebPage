/* @author gmounika */
import { Injectable } from '@angular/core';
import { AdvocateModule } from '../../components/advocate/advocate.module';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OverviewAdvocateService {
  constructor() {}
}
