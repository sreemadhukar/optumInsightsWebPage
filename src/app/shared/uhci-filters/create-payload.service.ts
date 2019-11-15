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
    this.currentPage.subscribe(value => {
      this.initialState.currentPage = value;
      // this.initialState = this.getPayloadForGettingReimbursed(this.initialState);
      this.changePayloadOnInit(this.getPayloadForGettingReimbursed(this.initialState));
    });
    this.timePeriod.subscribe(value => {
      this.initialState.timePeriod = value;
    });
    this.taxId.subscribe(taxId => (this.initialState.taxId = taxId));
    this.lineOfBusiness.subscribe(lineOfBusiness => (this.initialState.lineOfBusiness = lineOfBusiness));
    this.serviceSetting.subscribe(serviceSetting => (this.initialState.serviceSetting = serviceSetting));
    this.priorAuthType.subscribe(priorAuthType => {
      this.initialState.priorAuthType = priorAuthType;
    });
    this.trendMetric.subscribe(trendMetric => (this.initialState.trendMetric = trendMetric));
    this.trendDate.subscribe(trendDate => (this.initialState.trendDate = trendDate));
  }

  changePayloadOnInit(appliedPage) {
    switch (appliedPage) {
      case 'gettingReimbursedSummary':
        this.payload = this.getPayload(this.initialState);
        break;
      case 'nonPaymentsPage':
        this.payload = this.getPayload(this.initialState);
        break;
      case 'paymentsPage':
        this.payload = this.getPayload(this.initialState);
        break;
      case 'appealsPage':
        this.payload = this.getPayload(this.initialState);
        break;
      case 'priorAuthPage':
        this.payload = this.getPayloadForPriorAuth(this.initialState);
        break;
      case 'overviewAdvocatePage':
        this.payload = this.getPayload(this.initialState);
        break;
      case 'callsPage':
        this.payload = this.getPayloadForCalls(this.initialState);
        break;
    }
  }

  resetTinNumber(appliedPage) {
    this.taxId.subscribe(taxId => (this.initialState.taxId = [{ Tin: 'All', Tinname: 'All' }]));
    this.emitFilterEvent(appliedPage);
  }

  emitFilterEvent(appliedPage) {
    switch (appliedPage) {
      case 'gettingReimbursedSummary':
        this.payload = this.getPayload(this.initialState);
        this.payloadEmit.next({ value: this.getPayload(this.initialState) });
        break;
      case 'nonPaymentsPage':
        this.payload = this.getPayload(this.initialState);
        this.payloadEmit.next({ value: this.getPayload(this.initialState) });
        break;
      case 'paymentsPage':
        this.payload = this.getPayload(this.initialState);
        this.payloadEmit.next({ value: this.getPayload(this.initialState) });
        break;
      case 'appealsPage':
        this.payload = this.getPayload(this.initialState);
        this.payloadEmit.next({ value: this.getPayload(this.initialState) });
        break;
      case 'priorAuthPage':
        this.payload = this.getPayloadForPriorAuth(this.initialState);
        this.payloadEmit.next({ value: this.getPayloadForPriorAuth(this.initialState) });
        break;
      case 'overviewAdvocatePage':
        this.payload = this.getPayload(this.initialState);
        this.payloadEmit.next({ value: this.getPayload(this.initialState) });
        break;
      case 'callsPage':
        this.payload = this.getPayloadForCalls(this.initialState);
        this.payloadEmit.next({ value: this.getPayloadForCalls(this.initialState) });
        break;
    }
  }

  // resetToInitialState() {
  //   this.payloadEmit.next(this.initialPayload);
  // }

  getEvent(): Observable<any> {
    return this.payloadEmit.asObservable();
  }

  getPayloadForGettingReimbursed(temporaryState) {
    if (
      temporaryState.currentPage === 'paymentsPage' ||
      temporaryState.currentPage === 'nonPaymentsPage' ||
      temporaryState.currentPage === 'gettingReimbursedSummary'
    ) {
      if (
        temporaryState.timePeriod === 'Last12Months' ||
        temporaryState.timePeriod === '2018' ||
        temporaryState.timePeriod === '2017'
      ) {
        temporaryState.timePeriod = 'Last6Months';
      }
    } else {
      const serializedState = JSON.parse(sessionStorage.getItem('state'));
      if (serializedState && serializedState.timePeriod) {
        temporaryState.timePeriod = serializedState.timePeriod;
      }
    }
    return temporaryState.currentPage;
  }

  getPayloadForPriorAuth(payload) {
    const data = _.omit(payload, ['trendMetric', 'trendDate', 'currentPage']);
    return this.createTaxIdArrayForPA(data);
  }

  getPayload(payload) {
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

  getPayloadForCalls(payload) {
    const data = _.omit(payload, [
      'taxId',
      'lineOfBusiness',
      'serviceSetting',
      'priorAuthType',
      'trendMetric',
      'trendDate',
      'serviceCategory',
      'currentPage'
    ]);
    return data;
  }

  createTaxIdArrayForPA(param) {
    const arr = [];
    if (!_.isUndefined(param)) {
      param.taxId.forEach((taxId, index) => {
        arr.push(taxId.Tin.replace('-', ''));
      });
      param.taxId = arr;
    }
    return param;
  }

  createTaxIdString(data) {
    if (!_.isUndefined(data)) {
      if (data.taxId[0]['Tin'] !== 'All') {
        let string = '';
        data.taxId.forEach((taxId, index) => {
          string += taxId.Tin.replace('-', '') + (index !== data.taxId.length - 1 ? ',' : '');
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
