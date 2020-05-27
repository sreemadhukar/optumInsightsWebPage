import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { GlossaryMetricidService } from '../../../../shared/glossary-metricid.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../../shared/filter-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from '../../../../shared/common-utils.service';
import { StorageService } from '../../../../shared/storage-service.service';
import { CreatePayloadService } from '../../../../shared/uhci-filters/create-payload.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../../store/filter/actions';
import { IAppState } from '../../../../store/store';
import { SmartEditsSharedService } from '../../../../shared/new-payment-integrity/smart-edits-shared.service';
import { ModalPopupService } from 'src/app/common-utils/modal-popup/modal-popup.service';

@Component({
  selector: 'app-smart-edits',
  templateUrl: './smart-edits.component.html',
  styleUrls: ['./smart-edits.component.scss']
})
export class SmartEditsComponent implements OnInit {
  topReasonsData: any;
  loading: boolean;
  reportLink: string;
  pageTitle: String = '';
  metricId = 'NA';
  lob: string;
  taxID: Array<string>;
  timePeriod: string;
  smartEditClaimsReturned: any;
  smartEditsRepairedAndResubmittedTitle = 'Smart Edits Repaired & Resubmitted Response Time';
  smartEditsReasonTitle = 'Smart Edits Returned Claims Top Reasons';
  claimsTopReason = [];
  claimsInfoTopReason = [];
  smartEditsInformationalTitle = 'Smart Edits Top Informational Reasons';
  subscription: any;
  showSmartEdits = false;
  smartEditsData: any;
  smartEditsTopReasonsData: any;
  reasonDataAvailable: boolean;
  reason: any = [];
  constructor(
    private glossaryExpandService: GlossaryExpandService,
    public MetricidService: GlossaryMetricidService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private session: SessionService,
    private checkStorage: StorageService,
    private filtermatch: CommonUtilsService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>,
    private common: CommonUtilsService,
    private smartEditsSharedService: SmartEditsSharedService,
    private dialogService: ModalPopupService,
    private iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.pageTitle = 'Smart Edits';
    this.reportLink = 'View Smart Edits Reference Guide';
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
      this.createPayloadService.resetTinNumber('smartEditsPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
    });
    this.iconRegistry.addSvgIcon(
      'external-link',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/open_in_new-24px.svg')
    );
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'smartEditsPage' });
    this.checkStorage.emitEvent('smartEditsPage');
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.checkStorage.emitEvent('smartEditsPage');
    this.reasonDataAvailable = true;
    this.smartEditReturnedData();
    this.SmartEditReturneddTopReasons();
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

    this.smartEditClaimsReturned = {
      category: 'app-card',
      data: {
        centerNumber: '2.1K',
        color: ['#3381FF', '#80B0FF', '#003DA1'],
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
        color: ['#3381FF', '#80B0FF', '#003DA1']
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
    // **** Smart Edits Claims Top Reasons Ends here**** //
  }
  public handleClick() {
    const showPopUp = sessionStorage.getItem('dontShowPCORpopup');
    if (JSON.parse(showPopUp)) {
      this.saveData();
    } else {
      const options = {
        title: 'You are being directed to the Smart Edits Reference Guide',
        message:
          'A new browser window will open the Smart Edits Reference Guide, which is being hosted on uhcprovider.com.',
        cancelText: 'No Thanks, Stay Here.',
        dontShowText: 'Don’t show me this again this session.',
        confirmText: 'Continue'
      };

      this.dialogService.open(options);

      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.saveData();
        }
      });
    }
  }
  saveData() {
    window.open('https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ACE-Smart-Edits.pdf');
  }
  smartEditReturnedData() {
    // this.paymentLoading = true;
    // this.topRowMockCards = [{}, {}, {}];
    this.smartEditsSharedService
      .getSmartEditsReturnedShared(this.createPayloadService.payload)
      .then((smartEditsData: any) => {
        this.smartEditsData = smartEditsData;
        console.log('this.smartEditsData', this.smartEditsData);
        //  this.paymentLoading = false;
      })
      .catch(reason => {
        //   this.paymentLoading = false;
        console.log('Error in Smart Edits', reason);
      });
  }

  SmartEditReturneddTopReasons() {
    this.smartEditsSharedService
      .getSmartEditSharedTopReasons()
      .then((smartEditsTopReasonsData: any) => {
        this.topReasonsData = smartEditsTopReasonsData;
        console.log('this.TopReasonsData191', this.topReasonsData);

        if (this.topReasonsData !== null && this.topReasonsData.Data !== null) {
          this.reasonDataAvailable = true;
          this.loading = false;
        } else {
          this.reasonDataAvailable = false;
          this.loading = false;
        }
        this.reason = this.topReasonsData;
      })
      .catch(err => {
        console.log('Error', err);
        this.loading = false;
      });
  }
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.metricId);
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
