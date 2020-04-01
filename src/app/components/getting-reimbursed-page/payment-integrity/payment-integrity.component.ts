import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GettingReimbursedSharedService } from 'src/app/shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { GlossaryMetricidService } from '../../../shared/glossary-metricid.service';
import { GroupPremiumDesignationService } from '../../../rest/group-premium-designation/group-premium-designation.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  @Input() printStyle;
  medicalRecordsReturned: any;
  medicalRecordsOutstanding: any;
  pageTitle: String = '';
  printDateTitle: String = '';
  printDateSubTitle: String = '';
  subTitle: String = '';
  currentTabTitle: String = '';
  development = true;
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  title = 'Claims Payment Integrity';
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
  previousSelectedTab: any = 1;
  pageSubTitle: string;
  GroupPremiumDesignation: boolean;
  constructor(
    public groupPremiumDesignationService: GroupPremiumDesignationService,
    private glossaryExpandService: GlossaryExpandService,
    public MetricidService: GlossaryMetricidService,
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
    this.pageSubTitle = 'Reimbursements - Payment Integrity - ' + 'Medical Records Coding Review';
    this.subTitle = `Note: Claims Metrics are calculated using date medical record requested.
       Dashboard information/measurements are representing physician claims only.
         These measurements do not take into account facility claims.`;
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.loading = true;
    this.hppData();
    setTimeout(function() {
      this.hppData();
    }, 3000); // testing please remove if not used
    this.printDetails();
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'paymentIntegrityPage' });
    // this.smartEdit();
  }
  hppData() {
    this.groupPremiumDesignationService.gppObservable.subscribe(value => {
      this.loading = false;
      let data = <any>{};
      data = value;
      if (this.GroupPremiumDesignation !== data.HppIndicator) {
        this.GroupPremiumDesignation = data.HppIndicator;
        if (!this.GroupPremiumDesignation) {
          this.oldPaymentIntergrity();
        }
      }
    });
  }
  printDetails() {
    if (this.printStyle) {
      this.pageTitle = this.session.getHealthCareOrgName();
    }
  }
  helpIconClick(title, MetricID) {
    console.log(MetricID + title);
    this.glossaryExpandService.setMessage(title, MetricID);
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
  oldPaymentIntergrity() {
    this.loading = true;
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
      .then((r: any) => {
        this.loading = false;
        const temp1 = r;
        if (temp1 && temp1.hasOwnProperty('status') && temp1.status) {
          this.cardData = temp1;
        } else {
          if (r != null) {
            this.cardData = r;
            this.piDataloaded = true;
            const maxValue = Math.max(this.cardData.returnedWidth, this.cardData.notReturnedWidth);
            this.medicalRecordsReturned = {};
            this.medicalRecordsReturned['id'] = 'return';
            this.medicalRecordsReturned['title'] = 'Medical Records Returned';
            this.medicalRecordsReturned['numeric'] = this.cardData.returnedWidth;
            this.medicalRecordsReturned['maxValue'] = maxValue;
            this.medicalRecordsReturned['color'] = '#003da1';
            this.medicalRecordsOutstanding = {};
            this.medicalRecordsOutstanding['id'] = 'outstanding';
            this.medicalRecordsOutstanding['title'] = 'Medical Records Not Returned';
            this.medicalRecordsOutstanding['numeric'] = this.cardData.notReturnedWidth;
            this.medicalRecordsOutstanding['maxValue'] = maxValue;
            this.medicalRecordsOutstanding['color'] = '#fc6431';
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
  }
  smartEdit() {
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
}
