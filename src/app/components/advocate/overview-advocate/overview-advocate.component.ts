import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-overview-advocate',
  templateUrl: './overview-advocate.component.html',
  styleUrls: ['./overview-advocate.component.scss']
})
export class OverviewAdvocateComponent implements OnInit {
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  topRowItems: any;
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  loading: boolean;
  mockCards: any;
  subscription: any;
  claimsSubmitted: any;
  claimsPaid: any;
  claimsNotPaid: any;
  constructor(
    private checkStorage: StorageService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private filtermatch: CommonUtilsService
  ) {
    this.pageTitle = 'Welcome, ' + this.userName;
    this.pagesubTitle = 'Your Insights at a glance.';

    const filData = this.session.getFilChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    this.pageTitle = 'Calls';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.claimsSubmitted = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Paid',
      MetricID: 211,
      data: {
        graphValues: [34, 10, 40, 5],
        centerNumber: '$ 9.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsSubmittedTotal'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
    this.claimsPaid = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Paid',
      MetricID: 211,
      data: {
        graphValues: [10, 20, 30, 5],
        centerNumber: '$ 59.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsPaid'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
    this.claimsNotPaid = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Not Paid',
      MetricID: 211,
      data: {
        graphValues: [10, 20, 30, 5],
        centerNumber: '$ 39.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsNotPaid'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
  }

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Welcome, ' + this.userName;

    this.timePeriod = this.session.filterObjValue.timeFrame;

    this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    if (this.session.filterObjValue.tax.length > 0 && this.session.filterObjValue.tax[0] !== 'All') {
      this.taxID = this.session.filterObjValue.tax;
      if (this.taxID.length > 3) {
        this.taxID = [this.taxID.length + ' Selected'];
      }
    } else {
      this.taxID = ['All'];
    }
    this.loading = true;
    this.mockCards = [{}, {}];
    this.topRowItems = [];
    this.topRowItems = [this.claimsNotPaid, this.claimsPaid, this.claimsSubmitted];
    this.loading = false;
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
  removeFilter(type, value) {
    if (type === 'lob') {
      this.lob = '';
      this.session.store({ timeFrame: this.timePeriod, lob: 'All', tax: this.session.filterObjValue.tax });
    } else if (type === 'tax' && !value.includes('Selected')) {
      this.taxID = this.session.filterObjValue.tax.filter(id => id !== value);
      if (this.taxID.length > 0) {
        this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: this.taxID });
      } else {
        this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: ['All'] });
        this.taxID = [];
      }
    } else if (type === 'tax' && value.includes('Selected')) {
      this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: ['All'] });
      this.taxID = [];
    }
  }
}
