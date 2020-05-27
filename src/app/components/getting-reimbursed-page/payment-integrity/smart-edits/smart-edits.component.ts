import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'app-smart-edits',
  templateUrl: './smart-edits.component.html',
  styleUrls: ['./smart-edits.component.scss']
})
export class SmartEditsComponent implements OnInit {
  @Input() printStyle;
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
  seReturnedLoading: boolean;
  seRepairedLoading: boolean;
  smartEditClaimsRepairedResubmitted: any;
  returnMockCards: any;
  repairMockCards: any;
  lessThan5DaysBarData: any;
  greaterThan5DaysBarData: any;
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
    private smartEditsSharedService: SmartEditsSharedService
  ) {
    this.pageTitle = 'Smart Edits';
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
      this.createPayloadService.resetTinNumber('smartEditsPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'smartEditsPage' });
    this.checkStorage.emitEvent('smartEditsPage');
    //  this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.checkStorage.emitEvent('smartEditsPage');

    this.smartEditReturnedData();
    this.smartEditRepairedResubmittedData();
    //  this.timePeriod = this.session.filterObjValue.timeFrame;
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

  smartEditReturnedData() {
    this.seReturnedLoading = true;
    this.smartEditsSharedService
      .getSmartEditsReturnedShared(this.createPayloadService.payload)
      .then((smartEditsData: any) => {
        this.smartEditClaimsReturned = smartEditsData;
        this.timePeriod = this.smartEditClaimsReturned.timeperiod;
        this.seReturnedLoading = false;
      })
      .catch(reason => {
        this.seReturnedLoading = false;
        console.log('Error in Smart Edits', reason);
      });
  }

  smartEditRepairedResubmittedData() {
    this.smartEditsSharedService
      .getSmartEditsRepairedResubmittedShared(this.createPayloadService.payload)
      .then((smartEditsData: any) => {
        const maxValue = Math.max(smartEditsData[2], smartEditsData[3]);
        this.lessThan5DaysBarData = {};
        this.lessThan5DaysBarData['id'] = 'lessThan5';
        this.lessThan5DaysBarData['title'] = 'Less Than 5 Days';
        this.lessThan5DaysBarData['numeric'] = smartEditsData[2];
        this.lessThan5DaysBarData['maxValue'] = maxValue;
        this.lessThan5DaysBarData['color'] = '#3381ff';

        this.greaterThan5DaysBarData = {};
        this.greaterThan5DaysBarData['id'] = 'greaterThan5';
        this.greaterThan5DaysBarData['title'] = 'Greater Than 5 Days';
        this.greaterThan5DaysBarData['numeric'] = smartEditsData[3];
        this.greaterThan5DaysBarData['maxValue'] = maxValue;
        this.greaterThan5DaysBarData['color'] = '#fc6431';

        this.smartEditClaimsRepairedResubmitted = smartEditsData;
      })
      .catch(reason => {
        console.log('Error in Smart Edits', reason);
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
