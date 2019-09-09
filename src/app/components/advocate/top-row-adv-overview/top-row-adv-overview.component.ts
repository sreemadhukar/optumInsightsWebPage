import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-row-adv-overview',
  templateUrl: './top-row-adv-overview.component.html',
  styleUrls: ['./top-row-adv-overview.component.scss']
})
export class TopRowAdvOverviewComponent implements OnInit {
  claimsNotPaid;
  claimsPaid;
  claimsSubmitted;
  constructor() {}

  ngOnInit() {
    this.claimsSubmitted = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Paid',
      MetricID: 211,
      data: {
        graphValues: [34, 10, 40, 5],
        centerNumber: '$ 9.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsSubmittedTotal'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
    this.claimsPaid = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Paid',
      MetricID: 211,
      data: {
        graphValues: [10, 20, 30, 5],
        centerNumber: '$ 59.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsPaid'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
    this.claimsNotPaid = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: 'Claims Not Paid',
      MetricID: 211,
      data: {
        graphValues: [10, 20, 30, 5],
        centerNumber: '$ 39.5K',
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
        gdata: ['card-inner', 'claimsNotPaid'],
        sdata: {
          sign: '',
          data: ''
        },
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        hover: true
      },
      besideData: {
        labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
      },
      timeperiod: 'Last 6 Months'
    };
  }
}
