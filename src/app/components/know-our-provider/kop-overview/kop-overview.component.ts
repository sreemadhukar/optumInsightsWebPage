import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';
import { KOPSharedService } from 'src/app/shared/kop/kop.service';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';

export interface FilterOptions {
  title: string;
  default: boolean;
  selected: boolean;
  quarterFormat: string;
  timeFrameFormat: string;
  filters: string[];
}

@Component({
  selector: 'app-kop-overview',
  templateUrl: './kop-overview.component.html',
  styleUrls: ['./kop-overview.component.scss']
})
export class KopOverviewComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  // HEADER SECTION
  public pageTitle: string;
  public filterData: FilterOptions[] = [
    {
      title: 'Last Completed Quarter',
      selected: false,
      default: false,
      quarterFormat: 'default',
      timeFrameFormat: 'Quarter and Year',
      filters: ['LAST_COMPLETED_QUARTER']
    },
    {
      title: 'Year To Date',
      selected: false,
      default: false,
      timeFrameFormat: 'Year',
      quarterFormat: 'default',
      filters: ['YEAR_TO_DATE']
    },
    {
      title: 'Quarter over Quarter',
      selected: true,
      default: true,
      timeFrameFormat: 'Quarter vs Quarter',
      quarterFormat: 'default',
      filters: ['QUARTER_OVER_QUARTER']
    },
    {
      title: 'Total Last Year',
      selected: false,
      default: false,
      timeFrameFormat: 'Last Year',
      quarterFormat: 'YTD',
      filters: ['YEAR_TO_DATE', 'TOTAL_LAST_YEAR']
    }
  ];

  // NPS SECTION
  public npsLoaded: Boolean = false;
  public npsCardOptions: any = {
    npsHeader: true
  };
  public npsSummary: any = {};
  public currentFilter: any = {};
  public kopInsightsData: any = {};

  constructor(
    private eventEmitter: EventEmitterService,
    private filterExpandService: FilterExpandService,
    private sessionService: SessionService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private kopSharedService: KOPSharedService
  ) {
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser')) || {};
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';

    this.currentFilter = this.filterData.filter(element => element.default)[0];
    this.getNPSData();

    this.sessionService.getFilChangeEmitter().subscribe((data: any) => {
      const { selectedFilter } = data;

      this.filterData.forEach((filterDataItem: any) => {
        filterDataItem.selected = false;
        if (filterDataItem.title === selectedFilter) {
          filterDataItem.selected = true;
          this.currentFilter = filterDataItem;
        }
      });
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
    this.kopSharedService.getSummary({ filter: this.currentFilter }).then((data: any) => {
      if (data) {
        this.kopInsightsData = data;
        this.npsLoaded = true;
      }
    });
  }
}
