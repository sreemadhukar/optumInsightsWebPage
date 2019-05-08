import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  paymentsItems: any;
  payments: Array<object>;
  claimsPaidItems: Array<object>;
  pageTitle: String = '';
  userName: String = '';
  constructor(private gettingReimbursedSharedService: GettingReimbursedSharedService) {
    this.pageTitle = 'Claims Payments';
  }

  ngOnInit() {
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.paymentsItems = JSON.parse(JSON.stringify(completeData));
        this.payments = this.paymentsItems[1].data;
      })
      .catch(reason => console.log(reason.message));

    this.claimsPaidItems = [
      {
        title: 'Claims Paid'
      }
    ];
  }
}
