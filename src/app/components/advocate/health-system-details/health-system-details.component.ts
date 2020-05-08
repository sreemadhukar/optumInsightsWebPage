import { Component, OnInit } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { GroupPremiumDesignationService } from './../../../rest/group-premium-designation/group-premium-designation.service';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { NgRedux } from '@angular-redux/store';
import { REMOVE_FILTER } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from '../../../../../src/app/shared/session.service';

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

  constructor(
    private healthSystemService: HealthSystemDetailsSharedService,
    private groupPremiumDesignationService: GroupPremiumDesignationService,
    private checkStorage: StorageService,
    private router: Router,
    private common: CommonUtilsService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>,
    private session: SessionService
  ) {
    // this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    // const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
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
    if (this.healthSystemService.sharedParams.length === 0) {
      this.router.navigate(['/OverviewPageAdvocate']);
    } else {
      console.log('check', this.healthSystemService.sharedParams);
    }

    // const serializedState = JSON.parse(sessionStorage.getItem('state'));
    // if (serializedState) {
    //   serializedState.taxId = [{ Tin: this.data.FormattedTin, Tinname: this.data.TinName }];
    // }
    // const initialState = _.clone(INITIAL_STATE, true);
    // initialState.taxId = [{ Tin: this.data.FormattedTin, Tinname: this.data.TinName }];
    // this.ngRedux.dispatch({
    //   type: APPLY_FILTER,
    //   filterData: serializedState ? serializedState : initialState
    // });
    // window.location.href = '/OverviewPageAdvocate';
  }

  hppIndicator() {
    this.GroupPremiumDesignation = false;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (
      this.groupPremiumDesignationService.data !== null &&
      typeof this.groupPremiumDesignationService.data !== 'undefined'
    ) {
      if (currentUser[0].ProviderKey === this.groupPremiumDesignationService.data.ProviderKey) {
        this.GroupPremiumDesignation = this.groupPremiumDesignationService.data.HppIndicator;
        console.log(' this.GroupPremiumDesignation', this.GroupPremiumDesignation);
      }
    }
    this.groupPremiumDesignationService.gppObservable.subscribe(value => {
      let data = <any>{};
      data = value;
      this.GroupPremiumDesignation = data.HppIndicator;
      console.log(' this.GroupPremiumDesignation', this.GroupPremiumDesignation);
    });
  }
}
