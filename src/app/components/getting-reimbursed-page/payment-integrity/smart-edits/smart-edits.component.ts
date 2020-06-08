import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { GlossaryMetricidService } from '../../../../shared/glossary-metricid.service';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from '../../../../shared/common-utils.service';
import { StorageService } from '../../../../shared/storage-service.service';
import { CreatePayloadService } from '../../../../shared/uhci-filters/create-payload.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../../store/filter/actions';
import { IAppState } from '../../../../store/store';
import { SmartEditsSharedService } from '../../../../shared/new-payment-integrity/smart-edits-shared.service';
import { ModalPopupService } from '../../../../common-utils/modal-popup/modal-popup.service';

@Component({
  selector: 'app-smart-edits',
  templateUrl: './smart-edits.component.html',
  styleUrls: ['./smart-edits.component.scss']
})
export class SmartEditsComponent implements OnInit {
  @Input() printStyle;
  // topReasonsData: any;
  loading: boolean;
  reportLink: string;
  pageTitle: String = '';
  metricId = 'NA';
  lob: string;
  taxID: Array<string>;
  timePeriod: string;
  timePeriodr: string;
  smartEditClaimsReturned: any;
  smartEditsRepairedAndResubmittedTitle = 'Smart Edits Repaired & Resubmitted Response Time';
  smartEditsReasonTitle = 'Smart Edits Returned Claims Top Reasons';
  claimsTopReason = [];
  claimsInfoTopReason = [];
  smartEditsInformationalTitle = 'Smart Edits Top Informational Reasons';
  subscription: any;
  showSmartEdits = false;
  smartEditsData: any;
  seReturnedLoading = true;
  smartEditsTopReasonsData: any;
  reasonDataAvailable: boolean;
  reason: any = [];
  seRepairedLoading: boolean;
  seReasonsLoading = true;
  smartEditClaimsRepairedResubmitted: any;
  returnMockCards: any;
  repairMockCards: any;
  lessThan5DaysBarData: any;
  greaterThan5DaysBarData: any;
  constructor(
    private glossaryExpandService: GlossaryExpandService,
    public MetricidService: GlossaryMetricidService,
    private session: SessionService,
    private checkStorage: StorageService,
    private readonly createPayloadService: CreatePayloadService,
    private readonly ngRedux: NgRedux<IAppState>,
    private readonly common: CommonUtilsService,
    private readonly smartEditsSharedService: SmartEditsSharedService,
    private readonly dialogService: ModalPopupService,
    private readonly iconRegistry: MatIconRegistry,
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
    this.iconRegistry.addSvgIcon(
      'filter',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'smartEditsPage' });
    this.checkStorage.emitEvent('smartEditsPage');

    this.reasonDataAvailable = true;
    this.smartEditReturnedData();
    this.SmartEditReturneddTopReasons();
    this.timePeriod = this.session.filterObjValue.timeFrame;
    this.smartEditRepairedResubmittedData();
  }
  // modal poup function
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
  } // modalpopup function end
  saveData() {
    window.open('https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ACE-Smart-Edits.pdf');
  }
  // **** Smart Edits Claims Returned Starts here**** //
  smartEditReturnedData() {
    this.seReturnedLoading = true;
    this.smartEditsSharedService
      .getSmartEditsReturnedShared(this.createPayloadService.payload)
      .then((smartEditsData: any) => {
        this.smartEditClaimsReturned = smartEditsData;
        this.seReturnedLoading = false;
        this.timePeriodr = this.smartEditClaimsReturned.timeperiod;
      })
      .catch(reason => {
        console.log('Error in Smart Edits', reason);
        this.seReturnedLoading = false;
      });
  } // **** Ends here *** //

  // **** Smart Edits Repaired & Resubmitted Response Time Starts here**** //
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
  } // **** Ends here *** //

  // **** Smart Edits Claims Top Reasons Starts here**** //
  SmartEditReturneddTopReasons() {
    this.seReasonsLoading = true;
    this.smartEditsSharedService
      .getSmartEditSharedTopReasons(this.createPayloadService.payload)
      .then((smartEditsTopReasonsData: any) => {
        const topReasonsData = smartEditsTopReasonsData;

        console.log('this.topReasonsData', topReasonsData);
        if (topReasonsData && topReasonsData.lenth > 0) {
          this.reasonDataAvailable = true;
          this.seReasonsLoading = false;
        } else {
          this.reasonDataAvailable = false;
          this.seReasonsLoading = false;
        }
        this.reason = topReasonsData;
        console.log('reasons', this.reason);
      })
      .catch(err => {
        console.log('Error', err);
        this.seReasonsLoading = false;
      });
  }
  // **** Ends here *** //
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.metricId);
  }
}
