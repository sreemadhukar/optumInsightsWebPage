import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { APPLY_FILTER, RESET_FILTER } from '../../store/filter/actions';
import {
  TimePeriod,
  LineOfBusiness,
  ServiceSetting,
  ServiceCategory,
  PriorAuthDecisionType,
  TrendMetrics,
  filterToggles,
  MetricPropType,
  ClaimsFilter,
  AppealsFilter,
  ViewClaimsByFilter
} from './filter-settings/filter-options';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { SessionService } from '../../shared/session.service';
import { TaxId } from './filter-settings/filter-options';
import { CreatePayloadService } from '../../shared/uhci-filters/create-payload.service';
import { GettingReimbursedSharedService } from '../../shared/getting-reimbursed/getting-reimbursed-shared.service';

@Component({
  selector: 'app-uhci-filter',
  templateUrl: './uhci-filters.component.html',
  styleUrls: ['./uhci-filters.component.scss']
})
export class UhciFiltersComponent implements OnInit {
  @select(['uhc', 'currentPage']) currentPage;
  @select(['uhc', 'timePeriod']) timePeriod;
  @select(['uhc', 'taxId']) taxId;
  @select(['uhc', 'lineOfBusiness']) lineOfBusiness;
  @select(['uhc', 'serviceSetting']) serviceSetting;
  @select(['uhc', 'serviceCategory']) serviceCategory;
  @select(['uhc', 'priorAuthType']) priorAuthType;
  @select(['uhc', 'trendMetric']) trendMetric;
  @select(['uhc', 'trendDate']) trendDate;
  @select(['uhc', 'claimsFilter']) claimsFilter;
  @select(['uhc', 'appealsFilter']) appealsFilter;
  @select(['uhc', 'viewClaimsByFilter']) viewClaimsByFilter;
  @Output() filterFlag = new EventEmitter();

  selectedPage: string;
  timeFrames = TimePeriod;
  selectedTimePeriod: MetricPropType;
  lobs = LineOfBusiness;
  selectedLob: MetricPropType;
  claims = ClaimsFilter;
  appeals = AppealsFilter;
  selectedClaims: MetricPropType;
  selectedAppeals: MetricPropType;
  viewclaims = ViewClaimsByFilter;
  selectedViewClaimsBy: MetricPropType;
  serviceSettings = ServiceSetting;
  selectedServiceSetting: MetricPropType;
  serviceCategories = ServiceCategory;
  selectedServiceCategory: MetricPropType;
  priorAuthTypes = PriorAuthDecisionType;
  selectedPriorAuthType: MetricPropType;
  categories: any;
  selectedService: string;
  tinsData: any;
  priorAuthInitialState: MetricPropType;
  selectedTaxIds: TaxId[];
  trendMetricData = TrendMetrics;
  selectedTrendMetric: MetricPropType;
  selectedDate: Date;
  collapseToggle: any;
  public serviceCategoryForm = new FormControl();
  public gettingReimbursedTabName;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private location: Location,
    private session: SessionService,
    private createPayloadService: CreatePayloadService,
    private gettingReimbursedservice: GettingReimbursedSharedService
  ) {
    iconRegistry.addSvgIcon(
      'arrowdn',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
    this.collapseToggle = filterToggles;
    // this.selectedService=this.serviceCategories[0].name;
  }

  ngOnInit() {
    this.currentPage.subscribe(currentPage => (this.selectedPage = currentPage));

    if (this.selectedPage === 'gettingReimbursedSummary') {
      this.gettingReimbursedTabName = this.gettingReimbursedservice.gettingReimbursedTabName;
    } else {
      this.gettingReimbursedTabName = null;
    }
    this.timePeriod.subscribe(
      timePeriod =>
        (this.selectedTimePeriod = this.disableTimePeriod(this.timeFrames).find(val => val.name === timePeriod))
    );
    this.taxId.subscribe(taxId => (this.selectedTaxIds = taxId));
    this.lineOfBusiness.subscribe(
      lineOfBusiness => (this.selectedLob = this.lobs.find(val => val.name === lineOfBusiness))
    );
    this.claimsFilter.subscribe(
      claimsFilter => (this.selectedClaims = this.claims.find(val => val.name === claimsFilter))
    );
    this.appealsFilter.subscribe(
      appealsFilter => (this.selectedAppeals = this.appeals.find(val => val.value === appealsFilter))
    );
    this.viewClaimsByFilter.subscribe(
      viewClaimsByFilter => (this.selectedViewClaimsBy = this.viewclaims.find(val => val.name === viewClaimsByFilter))
    );

    this.serviceSetting.subscribe(
      serviceSetting => (this.selectedServiceSetting = this.serviceSettings.find(val => val.name === serviceSetting))
    );
    this.serviceCategory.subscribe(
      serviceCategory =>
        (this.selectedServiceCategory = this.serviceCategories.find(val => val.name === serviceCategory))
    );
    this.selectedService = this.selectedServiceCategory.value;

    this.priorAuthType.subscribe(priorAuthType => {
      this.selectedPriorAuthType = this.priorAuthTypes.find(val => val.name === priorAuthType);
      // this.priorAuthInitialState = this.priorAuthTypes.find(val => val.name === priorAuthType);
    });
    this.trendMetric.subscribe(
      trendMetric => (this.selectedTrendMetric = this.trendMetricData.find(val => val.name === trendMetric))
    );
    this.trendDate.subscribe(trendDate => (this.selectedDate = trendDate));
    this.session.getTins().then(data => {
      this.tinsData = data;
      this.tinsData.forEach(value => {
        this.selectedTaxIds.forEach(taxId => {
          if (taxId.Tin === 'All') {
            value['checked'] = false;
          } else if (taxId.Tin === value.Tin) {
            value['checked'] = true;
          }
        });
      });
    });
  }

  disableTimePeriod(timeFrame) {
    if (
      this.selectedPage === 'gettingReimbursedSummary' ||
      this.selectedPage === 'paymentsPage' ||
      this.selectedPage === 'nonPaymentsPage'
    ) {
      timeFrame.forEach(value => {
        if (value.name === 'Last12Months' || value.name === '2019' || value.name === '2018') {
          value.disable = true;
        }
      });
    } else {
      timeFrame.forEach(value => {
        value.disable = false;
      });
    }
    this.timeFrames = timeFrame;
    return timeFrame;
  }

  applyFilters() {
    this.ngRedux.dispatch({
      type: APPLY_FILTER,
      filterData: {
        timePeriod: this.selectedTimePeriod.name,
        taxId: this.selectedTaxIds.map(item => {
          delete item['checked'];
          return item;
        }),
        lineOfBusiness: this.selectedLob.name,
        serviceSetting: this.selectedServiceSetting.name,
        serviceCategory: this.selectedService,
        priorAuthType:
          this.selectedPriorAuthType && this.selectedPriorAuthType.hasOwnProperty['name']
            ? this.selectedPriorAuthType.name
            : 'All',
        trendMetric:
          this.selectedTrendMetric && this.selectedTrendMetric.hasOwnProperty['name']
            ? this.selectedTrendMetric.name
            : 'GettingReimbursed',
        trendDate: this.selectedDate ? this.selectedDate : new Date(),
        claimsFilter: this.selectedClaims.name,
        appealsFilter: this.selectedAppeals.name,
        viewClaimsByFilter: this.selectedViewClaimsBy.name
      }
    });
    this.createPayloadService.emitFilterEvent(this.selectedPage);
    this.filterFlag.emit(false);
  }

  resetFilters() {
    this.ngRedux.dispatch({ type: RESET_FILTER });
    this.selectedService = '';
    //   this.createPayloadService.resetToInitialState();
    this.createPayloadService.emitFilterEvent(this.selectedPage);
    this.filterFlag.emit(false);
  }

  doFilter(selectedServiceCategory) {
    if (selectedServiceCategory) {
      this.serviceCategory.subscribe(
        serviceCategory =>
          (this.selectedServiceCategory = this.serviceCategories.find(val => val.name === serviceCategory))
      );
      const filterValue = selectedServiceCategory.toLowerCase();
      return this.serviceCategories.filter(val => val.value.toLowerCase().startsWith(filterValue));
    }
    console.log('service category', this.serviceCategories);
    return this.serviceCategories;
  }

  selectedTaxId(selectedTins) {
    this.selectedTaxIds = selectedTins;
  }

  toggle(collapseState) {
    for (const key in this.collapseToggle) {
      if (key === collapseState && this.collapseToggle.hasOwnProperty(key)) {
        this.collapseToggle[key] = !this.collapseToggle[key];
      } else {
        this.collapseToggle[key] = false;
      }
    }
  }
}
