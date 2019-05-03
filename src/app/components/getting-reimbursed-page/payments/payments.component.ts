import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  pageTitle: String = '';
  paymentsItems: Array<Object> = [{}];
  timeFrame: String = '';
  constructor() {
    this.pageTitle = 'Claims Payments';
    this.timeFrame = 'Time Period - Time Period';
  }

  ngOnInit() {}
}
