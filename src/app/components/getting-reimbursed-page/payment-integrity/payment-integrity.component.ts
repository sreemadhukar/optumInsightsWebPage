import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GettingReimbursedSharedService } from 'src/app/shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  pageTitle: String = '';
  subTitle: String = '';
  currentTabTitle: String = '';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  title = '';
  smartEditsReasonTitle = 'Smart Edits Returned Claims Top Reasons';
  smartEditsRepairedAndResubmittedTitle = 'Smart Edits Repaired & Resubmitted Response Time';
  MetricID = 'NA';
  subscription: any;
  cardData: any;
  piDataloaded = false;
  loading: boolean;
  smartEditClaimsReturned: any;
  claimsTopReason: any = [];
  claimsInfoTopReason: any = [];
  smartEditsReasonsBool = false;
  showSmartEditsClaimsReturned = false;
  smartEditsInformationalTitle = 'Smart Edits Top Informational Reasons';
  showSmartEditsRepairedandResubmitted = false;
  showSmartEditsTopInfoReason = false;
  tabOptions: Array<Object> = [];
  tabOptionsTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  summaryItems: any;
  previousSelectedTab: any = 1;

  constructor(
    private glossaryExpandService: GlossaryExpandService,
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    private filtermatch: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'down-green-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/down-positive-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'up-red-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/up-negative-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.pageTitle = 'Medical Records Coding Review';
    this.tabOptionsTitle = ['Jul 1, 2018–Jun 30, 2019', 'Jul 1, 2019–Oct 31, 2019'];
    this.subTitle =
      'Note: Claims Metrics are calculated using date medical record requested. Dashboard' +
      'information/measurements are reperesenting physician claims only. These' +
      'measurements do not take into account facility claims.';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }
  matOptionClicked(i: number, event: any) {
    this.currentSummary = [];
    if (i === 1) {
      this.currentSummary = this.summaryItems;
    } else {
      this.currentSummary = null;
    }
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    this.previousSelectedTab = i;
  }
  ngOnInit() {
    this.tabOptions = [];
    let temp;
    temp = [
      {
        id: 0,
        title: this.getTabOptionsTitle(0),
        value1: '',
        sdata: null
      },
      {
        id: 1,
        title: this.getTabOptionsTitle(1),
        value1: '', // 'Claims Processed through Oct 31, 2020',
        sdata: null
      }
    ];
    this.tabOptions = temp;
    this.summaryItems = [
      {
        category: 'app-card',
        type: 'donutWithSideBottomLabel',
        title: 'Medical Records Requested by UHC',
        MetricID: '',
        data: {
          graphValues: [1100, 22000],
          centerNumber: '5%',
          centerData: 'of Claims Submitted',
          color: ['#3381FF', '#D7DCE1'],
          gdata: ['card-inner', 'totalClaimsSubmitted'],
          sdata: {
            sign: 'down-green',
            data: '-1.2%*'
          },
          labels: ['Records Requested', 'Claims Submitted'],
          hover: true
        },
        besideData: {
          labels: ['Medical Records Requested', 'Claims Submitted'],
          color: ['#3381FF', '#D7DCE1']
        },
        bottomData: {
          horizontalData: [
            {
              labels: '*Positive/negative trend comparision is Jun 2019 vs. Jul 2019'
            }
          ]
        }
      },
      {
        category: 'app-card',
        type: 'donutWithSideBottomLabel',
        title: 'Coding Review Results',
        MetricID: '',
        data: {}
      }
    ];
    this.currentSummary = this.summaryItems;
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'paymentIntegrityPage' });
    this.timePeriod = this.session.filterObjValue.timeFrame;
    if (this.session.filterObjValue.lob !== 'All') {
      this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    } else {
      this.lob = '';
    }
    if (this.session.filterObjValue.tax.length > 0 && this.session.filterObjValue.tax[0] !== 'All') {
      this.taxID = this.session.filterObjValue.tax;
      if (this.taxID.length > 3) {
        this.taxID = [this.taxID.length + ' Selected'];
      }
    } else {
      this.taxID = [];
    }
    this.piDataloaded = false;
    this.loading = true;
    this.gettingReimbursedSharedService
      .getPaymentIntegrityData()
      .then(r => {
        this.loading = false;
        const temp1 = JSON.parse(JSON.stringify(r));
        if (temp1 && temp1.hasOwnProperty('status') && temp1.status) {
          this.cardData = temp1;
        } else {
          if (r != null) {
            this.cardData = r;
            this.piDataloaded = true;
          } else {
            this.loading = false;
            this.piDataloaded = false;
          }
        }
      })
      .catch(error => {
        this.loading = false;
        this.piDataloaded = false;
      });

    this.smartEditClaimsReturned = {
      category: 'app-card',
      data: {
        centerNumber: '2.1K',
        color: ['#3381FF', '#80B0FF', '#00B8CC'],
        gdata: ['card-inner', 'smartEditsClaimsReturned'],
        graphValues: [1000, 500, 600],
        hover: true,
        labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken']
      },
      timeperiod: this.session.filterObjValue.timeFrame,
      title: 'Smart Edits Claims Returned',
      toggle: true,
      type: 'donutWithLabel',
      besideData: {
        labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken'],
        color: ['#3381FF', '#80B0FF', '#00B8CC']
      }
    };

    // **** Smart Edits Claims Top Reasons Starts here**** //
    const reasonsVal1 = [22, 19, 16, 12, 5];
    const reasonsVal2 = [78, 81, 84, 88, 95];
    const barTitle = [
      'NDC Unlisted Denials',
      'Replacement Code Denial',
      'ProTech, Incorrect Modifier',
      'Missing Texas Taxonomy Codes Reason Text Is Too Long',
      'Add-On Codes'
    ];
    const barVal = ['22%', '19%', '16%', '12%', '5%'];
    for (let i = 0; i <= 4; i++) {
      this.claimsTopReason.push({
        type: 'bar chart',
        graphValues: [reasonsVal1[i], reasonsVal2[i]],
        barText: barTitle[i],
        barValue: barVal[i],
        color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
        gdata: ['app-card-structure', 'smartEditsTopClaimsReason' + i]
      });
    }
    // **** Smart Edits Claims Top Reasons Starts here**** //
    // **** Smart Edits Top Informational Reasons starts here****//
    const rVal1 = [22, 19, 16, 12, 5];
    const rVal2 = [78, 81, 84, 88, 95];
    const bTitle = [
      'Credentials Expiring in 90 Days',
      'Modifier 52 Documentation Required',
      'Always Therapy GN Modifier',
      'Consultation Services Policy Update',
      'CMS 1500 Reimburdement Policy Rules'
    ];
    const bVal = ['22%', '19%', '16%', '12%', '5%'];
    for (let i = 0; i <= 4; i++) {
      this.claimsInfoTopReason.push({
        type: 'bar chart',
        graphValues: [rVal1[i], rVal2[i]],
        barText: bTitle[i],
        barValue: bVal[i],
        color: ['#80B0FF', '#FFFFFF', '#E0E0E0'],
        gdata: ['app-card-structure', 'smartEditsTopInfoReason' + i]
      });
    }
    // **** Smart Edits Top Informational Reasons starts here****//
  }

  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.MetricID);
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
