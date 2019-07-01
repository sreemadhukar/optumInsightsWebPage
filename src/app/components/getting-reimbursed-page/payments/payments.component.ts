import { Component, OnInit } from '@angular/core';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  title = 'Claims Paid Breakdown';
  claimsPaidTimePeriod = 'Last 6 Months'; // this.session.timeFrame;
  subscription: any;
  paymentsItems: any;
  payments: Array<object>;
  claimsPaidItems: Array<object>;
  pageTitle: String = '';
  userName: String = '';
  showClaimsPaid: Boolean = false;
  loading: boolean;
  mockCards: any;
  timePeriod = 'Last 6 Months';
  paymentArray: Array<object>;
  cData = [];
  // chartData: Array<object>;
  constructor(
    private checkStorage: StorageService,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry
  ) {
    this.pageTitle = 'Claims Payments';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  ngOnInit() {
    this.loading = true;
    this.mockCards = [{}, {}];
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.loading = false;
        this.paymentsItems = JSON.parse(JSON.stringify(completeData));
        this.payments = this.paymentsItems[1].data;
        console.log(this.payments);
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

    this.gettingReimbursedSharedService.claimsPaid().then(pData => {
      console.log(pData);
    });

    this.gettingReimbursedSharedService.getClaimsPaidBreakdownData().then(payData => {
      this.paymentArray = payData[0];

      for (let p = 0; p < 1; p++) {
        this.cData.push({
          chartData: [this.paymentArray[0], this.paymentArray[1], this.paymentArray[2], this.paymentArray[3]],
          gdata: ['card-inner', 'claimsPaidBreakDown']
        });
      }
      console.log(this.cData[0].gdata[1]);
    });
    // console.log(paymentArray);
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
