import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { select } from '@angular-redux/store';
import { PayLoad } from './payload.class';
import * as _ from 'lodash';
import { IAppState } from '../../store/store';

@Injectable({
  providedIn: 'root'
})
export class CreatePayloadService {
  @select(['uhc', 'currentPage']) currentPage;
  @select(['uhc', 'timePeriod']) timePeriod;
  @select(['uhc', 'taxId']) taxId;
  @select(['uhc', 'lineOfBusiness']) lineOfBusiness;
  @select(['uhc', 'commercial']) commercial;
  @select(['uhc', 'serviceSetting']) serviceSetting;
  @select(['uhc', 'serviceCategory']) serviceCategory;
  @select(['uhc', 'priorAuthType']) priorAuthType;
  @select(['uhc', 'trendMetric']) trendMetric;
  @select(['uhc', 'trendDate']) trendDate;
  @select(['uhc', 'claimsFilter']) claimsFilter;
  @select(['uhc', 'appealsFilter']) appealsFilter;
  @select(['uhc', 'viewClaimsByFilter']) viewClaimsByFilter;
  initialState: IAppState = {
    currentPage: 'overviewPage',
    timePeriod: 'Last6Months',
    taxId: [{ Tin: 'All', Tinname: 'All' }],
    lineOfBusiness: 'All',
    commercial: 'All',
    serviceSetting: 'All',
    serviceCategory: 'All',
    priorAuthType: 'All',
    trendMetric: 'GettingReimbursed',
    trendDate: new Date(),
    claimsFilter: 'All',
    appealsFilter: 'Received Date',
    viewClaimsByFilter: 'DOS'
  };
  payload: PayLoad = this.initialState;
  private payloadEmit = new Subject<any>();

  constructor() {
    this.currentPage.subscribe(value => {
      this.initialState.currentPage = value;
      this.changePayloadOnInit(this.getPayloadForGettingReimbursed(this.initialState));
    });
    this.timePeriod.subscribe(value => {
      this.initialState.timePeriod = value.name;
    });
    this.taxId.subscribe(taxId => (this.initialState.taxId = taxId));
    this.lineOfBusiness.subscribe(lineOfBusiness => (this.initialState.lineOfBusiness = lineOfBusiness));
    this.commercial.subscribe(commercial => (this.initialState.commercial = commercial));
    this.serviceSetting.subscribe(serviceSetting => (this.initialState.serviceSetting = serviceSetting));
    this.serviceCategory.subscribe(serviceCategory => (this.initialState.serviceCategory = serviceCategory));
    this.priorAuthType.subscribe(priorAuthType => {
      this.initialState.priorAuthType = priorAuthType;
    });
    this.trendMetric.subscribe(trendMetric => (this.initialState.trendMetric = trendMetric));
    this.trendDate.subscribe(trendDate => (this.initialState.trendDate = trendDate));
    this.claimsFilter.subscribe(claimsFilter => (this.initialState.claimsFilter = claimsFilter));
    this.appealsFilter.subscribe(appealsFilter => (this.initialState.appealsFilter = appealsFilter));
    this.viewClaimsByFilter.subscribe(viewClaimsBy => (this.initialState.viewClaimsByFilter = viewClaimsBy));
  }

  changePayloadOnInit(appliedPage: string) {
    this.payload = this.getPayload(this.initialState, appliedPage);
  }

  resetTinNumber(appliedPage: string) {
    this.initialState.taxId = [{ Tin: 'All', Tinname: 'All' }];
    if (appliedPage) {
      this.changePayloadOnInit(appliedPage);
    }
  }

  emitFilterEvent(appliedPage) {
    this.changePayloadOnInit(appliedPage);
    this.payloadEmit.next({ value: this.payload });
  }

  getEvent(): Observable<any> {
    return this.payloadEmit.asObservable();
  }

  getPayloadForGettingReimbursed(temporaryState: IAppState) {
    const serializedState = JSON.parse(sessionStorage.getItem('state'));
    if (serializedState && serializedState.timePeriod) {
      temporaryState.timePeriod = serializedState.timePeriod;
    }
    return temporaryState.currentPage;
  }

  getPayload(payload: any, currentPage?: string) {
    if (currentPage === 'priorAuthPage' || currentPage === 'viewTopClaimsPage') {
      const data = _.omit(payload, ['trendMetric', 'trendDate', 'currentPage']);
      return this.createTaxIdArrayForPA(data);
    } else if (currentPage === 'callsPage') {
      const data = _.omit(payload, [
        'taxId',
        'lineOfBusiness',
        'serviceSetting',
        'priorAuthType',
        'trendMetric',
        'trendDate',
        'serviceCategory',
        'currentPage',
        'claimsFilter',
        'AppealsFilter',
        'viewClaimsByFilter'
      ]);
      return data;
    } else {
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
  }

  createTaxIdArrayForPA(param) {
    const arr = [];
    if (!_.isUndefined(param)) {
      param.taxId.forEach(taxId => {
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
