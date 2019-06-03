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
  constructor(
    private checkStorage: StorageService,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private glossaryExpandService: GlossaryExpandService
  ) {
    this.pageTitle = 'Claims Payments';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.paymentsItems = JSON.parse(JSON.stringify(completeData));
        this.payments = this.paymentsItems[1].data;
        console.log(this.payments);
      })
      .catch(reason => console.log(reason.message));

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
