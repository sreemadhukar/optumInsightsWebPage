import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { PaymentsSharedService } from '../../../shared/getting-reimbursed/payments/payments-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  @Input() printStyle;
  title = 'Claims Paid Breakdown';
  MetricID = 'NA';
  claimsPaidBreakBool: Boolean = false;
  subscription: any;
  paymentsItems: any;
  payments: Array<object>;
  claimsPaidItems: Array<object>;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  showClaimsPaid: Boolean = false;
  loading: boolean;
  loadingClaimsBreakdown: boolean;
  mockCards: any;
  paymentArray: Array<object>;
  cData = [];
  // chartData: Array<object>;
  timePeriodClaimsBreakdown: string;
  viewClaimsByFilter: string;
  lob: string;
  taxID: Array<string>;
  constructor(
    private checkStorage: StorageService,
    private paymentsSharedService: PaymentsSharedService,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService,
    private common: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.pageTitle = 'Claims Payments';
    this.pagesubTitle = 'Getting Reimbursed - Payments';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('paymentsPage');
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

  ngOnInit() {
    if (this.printStyle) {
      this.pageTitle = this.session.getHealthCareOrgName();
    }

    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'paymentsPage' });
    this.viewClaimsByFilter = this.createPayloadService.payload['viewClaimsByFilter'];
    this.payments = [];
    this.claimsPaidBreakBool = false;
    this.loading = true;
    this.loadingClaimsBreakdown = true;
    this.mockCards = [{}, {}];
    this.paymentsSharedService
      .sharedPaymentsData(this.createPayloadService.payload)
      .then(completeData => {
        this.loading = false;
        this.paymentsItems = JSON.parse(JSON.stringify(completeData));
        this.payments = this.paymentsItems[0].data;
      })
      .catch(reason => {
        this.loading = false;
      });

    this.claimsPaidItems = [
      {
        title: 'Claims Paid'
      }
    ];

    // this.claimsPaidBreakBool = false;
    if (this.viewClaimsByFilter === 'DOP') {
      this.paymentsSharedService.getclaimsPaidData(this.createPayloadService.payload).then(
        data => {
          this.loadingClaimsBreakdown = false;
          const payData = JSON.parse(JSON.stringify(data));
          try {
            if (payData) {
              this.paymentArray = payData.data;
              this.cData = [];
              if (this.paymentArray) {
                for (let p = 0; p < 1; p++) {
                  this.cData.push({
                    chartData: [this.paymentArray[0], this.paymentArray[1], this.paymentArray[2], this.paymentArray[3]],
                    gdata: ['card-inner', 'claimsPaidBreakDown']
                  });
                }
                this.claimsPaidBreakBool = true;
              } else {
                this.cData.push(payData);
              }
              this.timePeriodClaimsBreakdown = payData.timePeriod;
            }
          } catch (Error) {
            this.loadingClaimsBreakdown = false;
            this.cData.push(payData.data);
            this.claimsPaidBreakBool = false;
          }
        },
        err => {
          console.log('Claims Breakdown Payment Page', err);
          this.claimsPaidBreakBool = false;
          this.loadingClaimsBreakdown = false;
        }
      );
    } else {
      this.paymentsSharedService.getclaimsPaidData(this.createPayloadService.payload).then(
        data => {
          this.loadingClaimsBreakdown = false;
          const payData = JSON.parse(JSON.stringify(data));
          try {
            if (payData) {
              this.paymentArray = payData.data;
              this.cData = [];
              if (this.paymentArray) {
                for (let p = 0; p < 1; p++) {
                  this.cData.push({
                    chartData: [this.paymentArray[0], this.paymentArray[1], this.paymentArray[2], this.paymentArray[3]],
                    gdata: ['card-inner', 'claimsPaidBreakDown']
                  });
                }
                this.claimsPaidBreakBool = true;
              } else {
                this.cData.push(payData);
              }
              this.timePeriodClaimsBreakdown = payData.timePeriod;
            }
          } catch (Error) {
            this.loadingClaimsBreakdown = false;
            this.cData.push(payData.data);
            this.claimsPaidBreakBool = false;
          }
        },
        err => {
          console.log('Claims Breakdown Payment Page', err);
          this.claimsPaidBreakBool = false;
          this.loadingClaimsBreakdown = false;
        }
      );
    }
  } // end ngOnInit()

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.MetricID);
  }
}
