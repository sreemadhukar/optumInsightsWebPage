import { Injectable, EventEmitter } from '@angular/core';
import { GettingReimbursedService } from '../rest/getting-reimbursed/getting-reimbursed.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Filter } from './_models/filter';
import { environment } from '../../environments/environment';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  filterChange: EventEmitter<any> = new EventEmitter();
  public timeFrame = 'Last 6 Months';
  public lob = 'All';
  public providerkey = this.providerKeyData();
  public tin = 'All';
  public nonPaymentBy = 'dollar';
  public filterObj: Observable<Filter>;
  public filterObjSubject: BehaviorSubject<Filter>;
  constructor(private gettingReimbursedService: GettingReimbursedService) {
    this.filterObjSubject = new BehaviorSubject<Filter>({
      timeFrame: 'Last 6 Months',
      lob: 'All',
      tax: ['All'],
      taxwithSymbols: ['All'],
      date: new Date(),
      metric: 'GettingReimbursed'
    });
    this.filterObj = this.filterObjSubject.asObservable().pipe(share());
  }
  public get filterObjValue(): Filter {
    return this.filterObjSubject.value;
  }
  public store(data: any): void {
    this.filterObjSubject.next(data);
    this.emitChangeEvent();
  }

  public emitChangeEvent() {
    this.filterChange.emit(this.filterObjSubject.value);
  }

  public getFilChangeEmitter() {
    return this.filterChange;
  }

  public providerKeyData() {
    if (sessionStorage.getItem('currentUser') && environment.internalAccess) {
      console.log(JSON.parse(sessionStorage.getItem('currentUser'))[0]['ProviderKey']);
      return JSON.parse(sessionStorage.getItem('currentUser'))[0]['ProviderKey'];
    } else if (sessionStorage.getItem('currentUser') && !environment.internalAccess) {
      return JSON.parse(sessionStorage.getItem('currentUser'))[0]['Providersyskey'];
    }
  }

  public getHealthCareOrgName() {
    if (sessionStorage.getItem('currentUser') && environment.internalAccess) {
      return JSON.parse(sessionStorage.getItem('currentUser'))[0]['HealthCareOrganizationName'];
    } else if (sessionStorage.getItem('currentUser') && !environment.internalAccess) {
      return JSON.parse(sessionStorage.getItem('currentUser'))[0]['Healthcareorganizationname'];
    }
  }

  public checkAdvocateRole(): Observable<boolean> {
    let userRole = false;
    try {
      if (
        JSON.parse(sessionStorage.getItem('loggedUser')) &&
        JSON.parse(sessionStorage.getItem('loggedUser')).UserPersonas
      ) {
        userRole = JSON.parse(sessionStorage.getItem('loggedUser')).UserPersonas.some(item =>
          item.UserRole.includes('UHCI_Advocate')
        );
      }
      return of(userRole);
    } catch (err) {
      console.log('adovate role session service', err);
      return of(userRole);
    }
  }

  public checkTrendAccess(): boolean {
    let trendAccess = false;
    try {
      if (JSON.parse(sessionStorage.getItem('trendAccess'))) {
        trendAccess = JSON.parse(sessionStorage.getItem('trendAccess')).trendAccess;
      }
      return trendAccess;
    } catch (err) {
      console.log('trendAccess unAvailable', err);
      return trendAccess;
    }
  }

  public checkProjectRole(): Observable<boolean> {
    let userRole = false;
    try {
      if (
        JSON.parse(sessionStorage.getItem('loggedUser')) &&
        JSON.parse(sessionStorage.getItem('loggedUser')).UserPersonas
      ) {
        userRole = JSON.parse(sessionStorage.getItem('loggedUser')).UserPersonas.some(item =>
          item.UserRole.includes('UHCI_Project')
        );
      }
      return of(userRole);
    } catch (err) {
      console.log('adovate role session service', err);
      return of(userRole);
    }
  }

  public isPCORData() {
    let pcorBoolean = false;
    try {
      if (JSON.parse(sessionStorage.getItem('pcor'))) {
        pcorBoolean = JSON.parse(sessionStorage.getItem('pcor')).isPCOR;
      }
      return pcorBoolean;
    } catch (err) {
      console.log('');
      return pcorBoolean;
    }
  }
  public sessionStorage(value: string, item: string) {
    if (sessionStorage.getItem(value)) {
      return JSON.parse(sessionStorage.getItem(value))[item];
    }
  }
  public getTins() {
    return new Promise((resolve, reject) => {
      if (sessionStorage.getItem('currentUser')) {
        if (environment.internalAccess) {
          this.providerkey = JSON.parse(sessionStorage.getItem('currentUser'))[0]['ProviderKey'];
        } else {
          this.providerkey = JSON.parse(sessionStorage.getItem('currentUser'))[0]['Providersyskey'];
        }
        this.gettingReimbursedService.getTins(this.providerkey).subscribe(tins => {
          const providerTins = tins;
          resolve(providerTins);
        });
      }
    });
  }
  get getProviderkey(): number {
    return this.providerkey;
  }

  set setProviderkey(value: number) {
    this.providerkey = value;
  }

  get getTin(): string {
    return this.tin;
  }

  set setTin(value: string) {
    this.tin = value;
  }

  get getTimeFrame(): string {
    return this.timeFrame;
  }
  set setTimeFrame(value: string) {
    this.timeFrame = value;
  }

  get getLob(): string {
    return this.lob;
  }

  set setLob(value: string) {
    this.lob = value;
  }

  get getNonPaymentBy(): string {
    return this.nonPaymentBy;
  }

  set setNonPaymentBy(value: string) {
    this.nonPaymentBy = value;
  }
}
