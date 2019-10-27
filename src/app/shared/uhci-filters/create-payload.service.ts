import { Injectable } from '@angular/core';
import { Subject, combineLatest, Observable } from 'rxjs';
import { select } from '@angular-redux/store';
import { PayLoad } from './payload.class';
import * as _ from 'lodash';
import { IAppState } from '../../store/store';

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
  initialState: IAppState = {
    currentPage: 'overviewPage',
    timePeriod: 'Last6Months',
    taxId: [{ Tin: 'All', Tinname: 'All' }],
    lineOfBusiness: 'All',
    serviceSetting: 'All',
    serviceCategory: '',
    priorAuthType: 'All',
    trendMetric: 'GettingReimbursed',
    trendDate: new Date()
  };
  payload: PayLoad = this.initialState;
  private payloadEmit = new Subject<any>();

  constructor() {
    this.currentPage.subscribe(value => (this.payload.currentPage = value));
    this.timePeriod.subscribe(value => {
      this.payload.timePeriod = value;
    });
    this.taxId.subscribe(taxId => (this.payload.taxId = taxId));
    this.lineOfBusiness.subscribe(lineOfBusiness => (this.payload.lineOfBusiness = lineOfBusiness));
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
        console.log('emit', this.getPayloadForNonPayments(this.payload));
        this.payloadEmit.next({ value: this.getPayloadForNonPayments(this.payload) });
    }
  }

  getEvent(): Observable<any> {
    return this.payloadEmit.asObservable();
  }

  getPayloadForNonPayments(payload) {
    const data = _.omit(payload, [
      'serviceSetting',
      'priorAuthType',
      'trendMetric',
      'trendDate',
      'serviceCategory',
      'currentPage'
    ]);
    return this.omitValuesContainAll(data);
  }

  createTaxIdString(data) {
    if (!_.isUndefined(data)) {
      if (data.taxId[0].Tin !== 'All') {
        let string = '';
        data.taxId.forEach(taxId => {
          string += taxId.Tin + ', ';
        });
        data.taxId = string;
      } else {
        data = _.omit(data, ['taxId']);
      }
    }
    return data;
  }
  omitValuesContainAll(data) {
    for (const key in data) {
      if (data[key] === 'All') {
        data = _.omit(data, [key]);
      }
    }
    return this.createTaxIdString(data);
  }
}
