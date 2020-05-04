import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FILTER_MASTER_DATA } from 'src/app/store/kopFilter/kopFilterMasterData';
import { select, NgRedux } from '@angular-redux/store';
import { KOPSharedService } from 'src/app/shared/kop/kop.service';

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
  selector: 'app-kop-nps',
  templateUrl: './kop-nps.component.html',
  styleUrls: ['./kop-nps.component.scss']
})
export class KopNpsComponent implements OnInit, OnDestroy {
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
  public kopNpsData: any = {};
  public isError = false;

  constructor(
    private eventEmitter: EventEmitterService,
    private filterExpandService: FilterExpandService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private kopSharedService: KOPSharedService,
    private ngRedux: NgRedux<any>
  ) {
    this.iconRegistry.addSvgIcon(
      'filter',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
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
      .getNpsDetails()
      .then((data: any) => {
        if (data) {
          this.kopNpsData = data;
          this.npsLoaded = true;
        } else {
          this.npsLoaded = true;
          this.isError = true;
        }
      })
      .catch(() => {
        this.npsLoaded = true;
        this.isError = true;
      });
  }
}
