import { Component, OnInit, Input } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit {
  @Input() printStyle;
  printRoute: string;
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  summaryItems: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  tabId: Number = 0;
  subscription: any;
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  tabOptions: Array<Object> = [];
  tabOptionsTitle: Array<String> = [];
  loading: boolean;
  mockCards: any;
  previousSelectedTab: any = 0;
  showDOSmessage = true;
  filterUrl = '/GettingReimbursed/Payments';
  buttonName: any;
  detailClickUrl = '/GettingReimbursed';
  buttonNumber: any;
  @select() currentPage;
  public filterFlag = false;
  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private session: SessionService,
    private common: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.printRoute = 'grSummary';
    this.pageTitle = 'Getting Reimbursed';
    this.currentTabTitle = '';
    this.tabOptionsTitle = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('gettingReimbursedSummary');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
      this.common.urlResuseStrategy();
    });
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
  }
  onDetailsButtonClick(i: number, event: any) {
    if (i === 0) {
      this.detailClickUrl = '/GettingReimbursed';
    } else if (i === 1) {
      this.detailClickUrl = '/GettingReimbursed/Payments';
    } else if (i === 2) {
      this.detailClickUrl = '/GettingReimbursed/NonPayments';
    } else if (i === 3) {
      this.detailClickUrl = '/GettingReimbursed/Appeals';
    }
    this.router.navigate([this.detailClickUrl]);
  }

  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }
  matOptionClicked(i: number, event: any) {
    if (i === 0) {
      this.gettingReimbursedSharedService.gettingReimbursedTabName = 'gettingReimbursedSummary';
      this.buttonName = '';
      this.buttonNumber = 0;
      this.filterFlag = false;
    } else if (i === 1) {
      this.gettingReimbursedSharedService.gettingReimbursedTabName = 'gettingReimbursedPayments';
      this.buttonName = 'More Payment Metrics';
      this.buttonNumber = 1;
      this.filterFlag = false;
    } else if (i === 2) {
      this.gettingReimbursedSharedService.gettingReimbursedTabName = 'gettingReimbursedNonPayments';
      this.buttonName = 'More Non-Payment Metrics';
      this.buttonNumber = 2;
      this.filterFlag = false;
    } else if (i === 3) {
      this.gettingReimbursedSharedService.gettingReimbursedTabName = 'gettingReimbursedAppeals';
      this.buttonName = 'More Appeals Metrics';
      this.buttonNumber = 3;
      this.filterFlag = true;
    }
    this.currentSummary = [];
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    this.previousSelectedTab = i;
    if (myTabs[i].id !== 'Appeals') {
      this.filterUrl = '/GettingReimbursed/Payments';
      this.showDOSmessage = true;
    } else {
      this.filterUrl = this.router.url;
      this.showDOSmessage = false;
    }
    //    event.target.classList.add('active');
  }

  printDownload(value) {
    console.log('Getting Reimbused print emiiter', value);
  }

  ngOnInit() {
    this.gettingReimbursedSharedService.gettingReimbursedTabName = 'gettingReimbursedSummary';
    this.pageTitle = 'Getting Reimbursed';
    this.printRoute = '/GettingReimbursed/print-grSummary';

    if (this.router.url.includes('print-')) {
      this.printStyle = true;
      this.pageTitle = this.session.getHealthCareOrgName();
      this.pagesubTitle = 'Getting Reimbursed - Summary';
    }

    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'gettingReimbursedSummary' });
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.loading = true;
    this.mockCards = [{}];
    this.gettingReimbursedSharedService
      .getGettingReimbursedData(this.createPayloadService.payload)
      .then(completeData => {
        this.loading = false;
        this.tabOptions = [];
        this.summaryItems = JSON.parse(JSON.stringify(completeData));
        console.log('gr Data', this.summaryItems);
        if (this.previousSelectedTab) {
          this.currentSummary = this.summaryItems[this.previousSelectedTab].data;
          this.currentTabTitle = this.summaryItems[this.previousSelectedTab].title;
        } else {
          this.currentSummary = this.summaryItems[0].data;
          this.currentTabTitle = this.summaryItems[0].title;
        }

        for (let i = 0; i < 4; i++) {
          let temp;
          if (this.summaryItems[i].data[0] != null && this.summaryItems[i].data[0].data != null) {
            temp = {
              id: i,
              title: this.getTabOptionsTitle(i),
              value1: this.summaryItems[i].data[0].data.centerNumber,
              sdata: {
                sign: this.summaryItems[i].data[0].data.sdata.sign,
                value: this.summaryItems[i].data[0].data.sdata.data
              }
            };
          } else {
            temp = {
              id: i,
              title: this.getTabOptionsTitle(i),
              value1: '--',
              sdata: null
            };
          }
          this.tabOptions.push(temp);
        }
      })
      .catch(reason => {
        this.loading = false;
        console.log('Getting Reimbursed Summary page', reason.message);
      });
  }
}
