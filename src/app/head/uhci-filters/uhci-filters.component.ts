import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { APPLY_FILTER, RESET_FILTER } from '../../store/filter/actions';
import { TimePeriod, LineOfBusiness, ServiceSetting } from './filter-settings/filter-options';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-uhci-filter',
  templateUrl: './uhci-filters.component.html',
  styleUrls: ['./uhci-filters.component.scss']
})
export class UhciFiltersComponent implements OnInit {
  @select() currentPage;
  @select() timePeriod;
  @select() taxId;
  @select() lineOfBusiness;
  @select() serviceSetting;
  @select() serviceCategory;
  toggleTimePeriod = false;
  toggleTaxId = false;
  toggleLob = false;
  toggleServiceSetting = false;
  toggleServiceCategory = false;
  current: string;
  timeFrames = TimePeriod;
  selectedTimePeriod: any;
  lobs = LineOfBusiness;
  selectedLob: any;
  serviceSettings = ServiceSetting;
  selectedServiceSetting: any;
  // serviceCategories = ServiceCategory;
  // selectedServiceCategory: any;

  constructor(private ngRedux: NgRedux<IAppState>, private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'arrowdn',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
  }

  ngOnInit() {
    this.currentPage.subscribe(currentPage => (this.current = currentPage));
    this.timePeriod.subscribe(
      timePeriod => (this.selectedTimePeriod = this.timeFrames.find(val => val.name === timePeriod))
    );
    this.lineOfBusiness.subscribe(
      lineOfBusiness => (this.selectedLob = this.lobs.find(val => val.name === lineOfBusiness))
    );
    this.serviceSetting.subscribe(
      serviceSetting => (this.selectedServiceSetting = this.serviceSettings.find(val => val.name === serviceSetting))
    );
    // this.serviceCategory.subscribe(serviceCategory => this.selectedServiceCategory =
    //   this.serviceCategories.find(val => val.name === serviceCategory));
  }

  applyFilters() {
    this.ngRedux.dispatch({
      type: APPLY_FILTER,
      filterData: {
        timePeriod: this.selectedTimePeriod.name,
        lineOfBusiness: this.selectedLob.name,
        serviceSetting: this.selectedServiceSetting.name
      }
    });
  }

  resetFilters() {
    this.ngRedux.dispatch({ type: RESET_FILTER });
  }
}
