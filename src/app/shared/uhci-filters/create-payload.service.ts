import { Injectable } from '@angular/core';
import { Subject, combineLatest, Observable } from 'rxjs';
import { select } from '@angular-redux/store';
import { PayLoad } from './payload.class';
import { INITIAL_STATE } from '../../store/filter/reducer';

@Injectable({
  providedIn: 'root'
})
export class CreatePayloadService {
  @select() currentPage;
  @select() timePeriod;
  @select() taxId;
  @select() lineOfBusiness;
  @select() serviceSetting;
  @select() serviceCategory;
  @select() priorAuthType;
  @select() trendMetric;
  @select() trendDate;
  payload: PayLoad = INITIAL_STATE;
  private payloadEmit = new Subject<any>();

  constructor() {
    this.timePeriod.subscribe(value => {
      this.payload.timePeriod = value;
    });
    this.taxId.subscribe(taxId => (this.payload.taxId = taxId));
    this.lineOfBusiness.subscribe(lineOfBusiness => (this.payload.lob = lineOfBusiness));
    this.serviceSetting.subscribe(serviceSetting => (this.payload.serviceSetting = serviceSetting));
    this.priorAuthType.subscribe(priorAuthType => {
      this.payload.priorAuthType = priorAuthType;
    });
    this.trendMetric.subscribe(trendMetric => (this.payload.trendMetric = trendMetric));
    this.trendDate.subscribe(trendDate => (this.payload.trendDate = trendDate));
  }

  emitFilterEvent(appliedPage) {
    switch (appliedPage) {
      case 'nonPaymentsPage':
        console.log('emit', this.payload);
        this.payloadEmit.next({ value: this.payload });
    }
  }

  getEvent(): Observable<any> {
    console.log(this.payloadEmit);
    return this.payloadEmit.asObservable();
  }
}
