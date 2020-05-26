import { Component, OnInit } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GroupPremiumDesignationService } from './../../../rest/group-premium-designation/group-premium-designation.service';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { NgRedux, select } from '@angular-redux/store';
import { REMOVE_FILTER, APPLY_FILTER } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { INITIAL_STATE } from '../../../store/filter/reducer';
import * as _ from 'lodash';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from '../../../../../src/app/shared/session.service';
import { TaxId } from '../../../head/uhci-filters/filter-settings/filter-options';

@Component({
  selector: 'app-health-system-details',
  templateUrl: './health-system-details.component.html',
  styleUrls: ['./health-system-details.component.scss']
})
export class HealthSystemDetailsComponent implements OnInit {
  dataLoading: boolean;
  healthSystemData: any;
  subscription: any;
  GroupPremiumDesignation: any;
  selectedTaxId: TaxId[];
  @select(['uhc', 'taxId']) taxId;
  selectedTin;

  constructor(
    private healthSystemService: HealthSystemDetailsSharedService,
    private readonly groupPremiumDesignationService: GroupPremiumDesignationService,
    private checkStorage: StorageService,
    private readonly common: CommonUtilsService,
    private readonly createPayloadService: CreatePayloadService,
    private readonly ngRedux: NgRedux<IAppState>,
    private readonly session: SessionService
  ) {
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.taxId.subscribe(taxId => (this.selectedTaxId = taxId));
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
      this.createPayloadService.resetTinNumber('HealthSystemDetails');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
    });
    this.hppIndicator();
  }

  ngOnInit() {
    this.healthSystemData = null;
    this.checkStorage.emitEvent('HealthSystemDetails');
    this.getHealthSystemDetails();
    this.selectedTin = this.selectedTaxId;
  }

  getHealthSystemDetails() {
    this.dataLoading = true;
    this.healthSystemService
      .getHealthSystemData()
      .then(healthSystemData => {
        this.dataLoading = false;
        this.healthSystemData = healthSystemData;
      })
      .catch(reason => {
        this.dataLoading = false;
        console.log('Health System Details are not available', reason);
      });
  }

  viewInsights() {
    const serializedState = JSON.parse(sessionStorage.getItem('state'));
    if (serializedState) {
      serializedState.taxId = this.selectedTin.length > 0 ? this.selectedTin : [{ Tin: 'All', Tinname: 'All' }];
    }
    const initialState = _.clone(INITIAL_STATE, true);
    initialState.taxId = this.selectedTin.length > 0 ? this.selectedTin : [{ Tin: 'All', Tinname: 'All' }];
    this.ngRedux.dispatch({
      type: APPLY_FILTER,
      filterData: serializedState ? serializedState : initialState
    });
    window.location.href = '/OverviewPageAdvocate';
  }

  hppIndicator() {
    this.GroupPremiumDesignation = false;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (
      this.groupPremiumDesignationService.data !== null &&
      typeof this.groupPremiumDesignationService.data !== 'undefined' &&
      currentUser[0].ProviderKey === this.groupPremiumDesignationService.data.ProviderKey
    ) {
      this.GroupPremiumDesignation = this.groupPremiumDesignationService.data.HppIndicator;
    }
    this.groupPremiumDesignationService.gppObservable.subscribe(value => {
      const data = JSON.parse(JSON.stringify(value));
      this.GroupPremiumDesignation = data['HppIndicator'];
    });
  }

  getSelectedTaxIds($event) {
    this.selectedTin = $event;
  }
}
