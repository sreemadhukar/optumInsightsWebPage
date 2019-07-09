import { Component, OnInit } from '@angular/core';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonUtilsService } from '../../../shared/common-utils.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  title = 'Claims Paid Breakdown';
  claimsPaidTimePeriod = 'Last 6 Months'; // this.session.timeFrame;
  claimsPaidBreakBool: Boolean = false;
  subscription: any;
  paymentsItems: any;
  payments: Array<object>;
  claimsPaidItems: Array<object>;
  pageTitle: String = '';
  userName: String = '';
  showClaimsPaid: Boolean = false;
  loading: boolean;
  mockCards: any;
  // timePeriod = 'Last 6 Months';
  paymentArray: Array<object>;
  cData = [];
  // chartData: Array<object>;
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  constructor(
    private checkStorage: StorageService,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private filtermatch: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    this.pageTitle = 'Claims Payments';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    this.payments = [];
    this.claimsPaidBreakBool = false;
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
    this.mockCards = [{}, {}];
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.loading = false;
        this.paymentsItems = JSON.parse(JSON.stringify(completeData));
        this.payments = this.paymentsItems[1].data;
      })
      .catch(reason => {
        console.log(reason.message);
        this.loading = false;
      });

    this.claimsPaidItems = [
      {
        title: 'Claims Paid'
      }
    ];

    this.gettingReimbursedSharedService.getclaimsPaidData().then(
      payData => {
        this.claimsPaidBreakBool = true;
        this.loading = false;
        this.paymentArray = payData[0];
        this.cData = [];
        for (let p = 0; p < 1; p++) {
          this.cData.push({
            chartData: [this.paymentArray[0], this.paymentArray[1], this.paymentArray[2], this.paymentArray[3]],
            gdata: ['card-inner', 'claimsPaidBreakDown']
          });
        }
      },
      err => {
        console.log('Claims Breakdown Payment Page', err);
        this.claimsPaidBreakBool = false;
      }
    );
  } // end ngOnInit()

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
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
