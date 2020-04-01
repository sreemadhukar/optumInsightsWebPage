import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';
import { KOPSharedService } from 'src/app/shared/kop/kop.service';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { select, NgRedux } from '@angular-redux/store';
import { FILTER_MASTER_DATA } from 'src/app/store/kopFilter/kopFilterMasterData';
// import { get as _get } from 'lodash.find';

export interface FilterOptions {
  title: string;
  default: boolean;
  selected: boolean;
  quarterFormat: string;
  timeFrameFormat: string;
  filters: string[];
  priorAuthFilters: string[];
}

@Component({
  selector: 'app-kop-overview',
  templateUrl: './kop-overview.component.html',
  styleUrls: ['./kop-overview.component.scss']
})
export class KopOverviewComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @select(['kop', 'timePeriod']) timePeriod;
  // HEADER SECTION
  public pageTitle: string;
  public filterData: FilterOptions[] = FILTER_MASTER_DATA;
  // NPS SECTION
  public npsLoaded: Boolean = false;
  public npsCardOptions: any = {
    npsHeader: true
  };
  public npsSummary: any = {};
  public currentFilter: any = {};
  public kopInsightsData: any = {};
  public isError = false;

  constructor(
    private eventEmitter: EventEmitterService,
    private filterExpandService: FilterExpandService,
    private sessionService: SessionService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private kopSharedService: KOPSharedService,
    private ngRedux: NgRedux<any>
  ) {
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );
  }

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser')) || {};
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
    this.timePeriod.subscribe(val => {
      if (val === this.currentFilter['timePeriod']) {
        return;
      }
      const currentFilterState = this.ngRedux.getState();
      this.currentFilter = currentFilterState['kop'];
      this.npsLoaded = false;
      this.isError = false;
      this.getNPSData();
    });
  }

  ngOnDestroy(): void {
    this.eventEmitter.emitEvent(false);
  }

  openFilter() {
    this.filterExpandService.setData({ url: this.router.url, customFilter: true, filterData: this.filterData });
  }

  getNPSData() {
    this.kopSharedService
      .getSummary({ filter: this.currentFilter })
      .then((data: any) => {
        if (data) {
          this.showMetricDevelopment(data);
          this.kopInsightsData = data;
          this.npsLoaded = true;
          this.loadOtherMetrics();
        } else {
          this.kopInsightsData = null;
          this.npsLoaded = true;
          this.isError = true;
        }
      })
      .catch(err => {
        this.kopInsightsData = null;
        this.npsLoaded = true;
        this.isError = true;
      });
  }

  loadOtherMetrics() {
    try {
      this.getPriorAuthTATSummary();
      this.getReimbursementClaimsData();
    } catch (error) {
      console.log('Error in Prior Auth | Prior Auth TAT | Reimbursement');
    }
  }

  getPriorAuthTATSummary() {
    this.kopSharedService.getPriorAuthTATSummary({ filter: this.currentFilter }).then((data: any) => {
      if (data) {
        const {
          careDelivery: { chartData }
        } = data;
        this.kopInsightsData.careDelivery.chartData.forEach((chartItem: any, index: number) => {
          if (chartItem.metricType === 'priorauthtat') {
            Object.assign(chartItem, { ...chartData[index] });
          }
        });
      }
    });
  }

  getReimbursementClaimsData() {
    this.kopSharedService
      .getClaimsData({
        filter: this.currentFilter,
        region: 'LEASED MARKETS',
        markets: ['MINNEAPOLIS, MN', 'CHICAGO, IL']
      })
      .then((data: any) => {
        if (data) {
          const {
            reimbursement: { chartData }
          } = data;
          this.kopInsightsData.reimbursement.chartData.forEach((chartItem: any, index: number) => {
            if (chartItem.metricType === 'reimbursementClaims') {
              Object.assign(chartItem, { ...chartData[index] });
            }
          });
        }
      });
  }

  showMetricDevelopment(kopInsightsData) {
    for (const key in kopInsightsData) {
      if (kopInsightsData.hasOwnProperty(key)) {
        if (kopInsightsData[key].title === 'Engagement') {
          for (const item of kopInsightsData[key].chartData) {
            item.showMetricProgressIcon = true;
          }
        }
        if (kopInsightsData[key].title === 'Issue Resolution' || kopInsightsData[key].title === 'Onboarding') {
          for (const item of kopInsightsData[key].chartData) {
            if (item.cardType === 'horizontalBar' || item.cardType === 'verticalBar') {
              item.showMetricProgressIcon = true;
            } else {
              item.showMetricProgressIcon = false;
            }
          }
        }
      }
    }
  }

  /**
   * Reload the current page
   */
  reload() {
    location.reload();
  }
}
