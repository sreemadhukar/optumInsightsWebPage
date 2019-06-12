import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  title = 'Claims Paid Breakdown';
  claimsPaidTimePeriod = 'Rolling 6 Months';
  subscription: any;
  paymentsItems: any;
  payments: Array<object>;
  claimsPaidItems: Array<object>;
  pageTitle: String = '';
  userName: String = '';
  showClaimsPaid: Boolean = false;
  subscription: any;
  loading: boolean;
  mockCards: any;
  constructor(
    private checkStorage: StorageService,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private glossaryExpandService: GlossaryExpandService,
    private checkStorage: StorageService
  ) {
    this.pageTitle = 'Claims Payments';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
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
  }
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
