import { Component, OnInit, Input } from '@angular/core';
import { IAdvTinDetailsResponse } from '../../user.class';
import { StorageService } from '../../../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { APPLY_FILTER } from '../../../../../store/filter/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../../../store/store';
import { INITIAL_STATE } from '../../../../../store/filter/reducer';
import * as _ from 'lodash';

@Component({
  selector: 'app-impact-card',
  templateUrl: './impact-card.component.html',
  styleUrls: ['./impact-card.component.scss']
})
export class ImpactCardComponent implements OnInit {
  @Input() data: IAdvTinDetailsResponse;
  linkName = 'Overview';
  constructor(
    private storage: StorageService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg'
      )
    );
  }

  ngOnInit() {}

  providerSelection() {
    if (this.data !== null) {
      const providerData = JSON.parse(sessionStorage.getItem('currentUser'));
      const provider = providerData[0];
      if (providerData[0].hasOwnProperty('Providersyskey')) {
        provider.healthcareorganizationname = this.data.ProviderSystem;
        provider.ProviderKey = this.data.ProviderSysKey;
        this.storage.store('currentUser', [provider]);
      } else {
        const providerObj = {
          HealthCareOrganizationName: this.data.ProviderSystem,
          ProviderKey: this.data.ProviderSysKey
        };
        this.storage.store('currentUser', [Object.assign(provider, providerObj)]);
      }
    }
  }

  navigateToHealthSystemDetails() {
    this.providerSelection();
    window.location.href = '/OverviewPageAdvocate/HealthSystemDetails/';
  }

  navigateToOverview() {
    this.providerSelection();
    const serializedState = JSON.parse(sessionStorage.getItem('state'));
    if (serializedState) {
      serializedState.taxId = [{ Tin: this.data.FormattedTin, Tinname: this.data.TinName }];
    }
    const initialState = _.clone(INITIAL_STATE, true);
    initialState.taxId = [{ Tin: this.data.FormattedTin, Tinname: this.data.TinName }];
    this.ngRedux.dispatch({
      type: APPLY_FILTER,
      filterData: serializedState ? serializedState : initialState
    });
    window.location.href = '/OverviewPageAdvocate';
  }
}
