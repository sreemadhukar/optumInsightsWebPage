import { Component, OnInit, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { Router, NavigationStart } from '@angular/router';
import { INITIAL_STATE } from '../../store/filter/reducer';
import {
  LineOfBusiness,
  PriorAuthDecisionType,
  ServiceCategory,
  ServiceSetting,
  TimePeriod,
  TrendMetrics,
  ClaimsFilter,
  AppealsFilter
} from '../../head/uhci-filters/filter-settings/filter-options';
import { FilterExpandService } from '../../shared/filter-expand.service';
import { TaxId } from '../../head/uhci-filters/filter-settings/filter-options';
import { APPLY_FILTER, REMOVE_FILTER } from '../../store/filter/actions';
import { CreatePayloadService } from '../../shared/uhci-filters/create-payload.service';

@Component({
  selector: 'app-filters-applied',
  templateUrl: './filters-applied.component.html',
  styleUrls: ['./filters-applied.component.scss']
})
export class FiltersAppliedComponent implements OnInit {
  @select() currentPage;
  @select() timePeriod;
  @select() taxId;
  @select() lineOfBusiness;
  @select() serviceSetting;
  @select() serviceCategory;
  @select() priorAuthType;
  @select() trendMetric;
  @select() trendDate;
  @select() claimsFilter;
  @select() appealsFilter;
  @Input() flag;
  @Input() tabName;
  selectedPage: any;
  timeFrames = TimePeriod;
  selectedTimePeriod: any;
  lobs = LineOfBusiness;
  selectedLob: any;
  claims = ClaimsFilter;
  appeals = AppealsFilter;
  selectedClaims: any;
  selectedAppeals: any;
  serviceSettings = ServiceSetting;
  selectedServiceSetting: any;
  serviceCategories = ServiceCategory;
  selectedServiceCategory: any;
  priorAuthTypes = PriorAuthDecisionType;
  selectedPriorAuthType: any;
  selectedTaxIds: TaxId[];
  trendMetricData = TrendMetrics;
  selectedTrendMetric: any;
  selectedDate: Date;
  previousDate: any = new Date();
  printStyle: boolean;
  constructor(
    private filterExpandService: FilterExpandService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>,
    private route: Router
  ) {
    // To disable open of Filter at Print page
    // this.route.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.printStyle = event.url.includes('print-');
    //   }
    // });
  }

  ngOnInit() {
    this.printStyle = this.route.url.includes('print-');
    this.currentPage.subscribe(currentPage => (this.selectedPage = currentPage));
    this.timePeriod.subscribe(
      timePeriod => (this.selectedTimePeriod = this.timeFrames.find(val => val.name === timePeriod))
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
    this.serviceSetting.subscribe(
      serviceSetting => (this.selectedServiceSetting = this.serviceSettings.find(val => val.name === serviceSetting))
    );

    this.priorAuthType.subscribe(
      priorAuthType => (this.selectedPriorAuthType = this.priorAuthTypes.find(val => val.name === priorAuthType))
    );
    this.serviceCategory.subscribe(
      serviceCategory =>
        (this.selectedServiceCategory = this.serviceCategories.find(val => val.name === serviceCategory))
    );
    this.trendMetric.subscribe(
      trendMetric => (this.selectedTrendMetric = this.trendMetricData.find(val => val.name === trendMetric))
    );
    this.trendDate.subscribe(trendDate => {
      this.selectedDate = new Date(trendDate);
      this.previousDate = new Date(this.selectedDate.toString());
      this.previousDate = this.previousDate.setDate(this.selectedDate.getDate() - 1);
    });
  }

  openFilter() {
    this.filterExpandService.setURL('');
  }

  removeAppliedFilter(filterType, taxId?) {
    switch (filterType) {
      case 'taxId':
        if (taxId) {
          const updatedTaxIds = this.selectedTaxIds.filter(item => {
            return item.Tin !== taxId.Tin;
          });
          if (updatedTaxIds.length === 0) {
            this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
          } else {
            this.ngRedux.dispatch({
              type: APPLY_FILTER,
              filterData: {
                timePeriod: this.selectedTimePeriod.name,
                taxId: updatedTaxIds,
                lineOfBusiness: this.selectedLob.name,
                serviceSetting: this.selectedServiceSetting.name,
                serviceCategory: this.selectedServiceCategory ? this.selectedServiceCategory.name : '',
                priorAuthType: this.selectedPriorAuthType.name,
                trendMetric: this.selectedTrendMetric.name,
                trendDate: this.selectedDate,
                claimsFilter: this.selectedClaims.name,
                appealsFilter: this.selectedAppeals.name
              }
            });
          }
        } else {
          this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
        }
        break;
      case 'lob':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { lineOfBusiness: true } });
        break;
      case 'claims':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { claimsFilter: true } });
        break;
      case 'appeals':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { appealsFilter: true } });
        break;
      case 'serviceSetting':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { serviceSetting: true } });
        break;
      case 'serviceCategory':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { serviceCategory: true } });
        break;
      case 'priorAuthType':
        this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { priorAuthType: true } });
        break;
    }
    this.createPayloadService.emitFilterEvent(this.selectedPage);
  }
}
