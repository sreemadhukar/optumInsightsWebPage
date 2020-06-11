import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
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
  reportLink: string;
  pageTitle: String = '';
  pagesubTitle: String = '';
  subscription: any;
  seReturnedLoading = true;
  seRepairedLoading = true;
  seReasonsLoading = true;

  smartEditClaimsReturned: any = {};
  smartEditClaimsRepairedResubmitted: any = {};
  reasonsData: any = {};

  constructor(
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
    if (this.printStyle) {
      this.pageTitle = this.session.getHealthCareOrgName();
      this.pagesubTitle = 'Getting Reimbursed - Payment Integrity - Smart Edits';
    } else {
      this.pageTitle = 'Smart Edits';
      this.reportLink = 'View Smart Edits Reference Guide';
    }
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'smartEditsPage' });
    this.checkStorage.emitEvent('smartEditsPage');
    this.smartEditReturnedData();
    this.SmartEditReturneddTopReasons();
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

  // Section 1
  smartEditReturnedData() {
    this.seReturnedLoading = true;
    this.smartEditsSharedService
      .getSmartEditsReturnedShared(this.createPayloadService.payload)
      .then((smartEditsData: any) => {
        this.smartEditClaimsReturned = smartEditsData;
        this.seReturnedLoading = false;
      });
  }

  // Section 2
  smartEditRepairedResubmittedData() {
    this.seRepairedLoading = true;
    this.smartEditsSharedService
      .getSmartEditsRepairedResubmittedShared(this.createPayloadService.payload)
      .then((result: any) => {
        this.smartEditClaimsRepairedResubmitted = result;
        this.seRepairedLoading = false;
      });
  }

  // Section 3
  SmartEditReturneddTopReasons() {
    this.seReasonsLoading = true;
    this.smartEditsSharedService.getSmartEditSharedTopReasons(this.createPayloadService.payload).then((result: any) => {
      this.reasonsData = result;
      this.seReasonsLoading = false;
    });
  }
}
