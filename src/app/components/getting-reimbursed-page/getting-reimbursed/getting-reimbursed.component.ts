import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit {
  summaryItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor() {
    this.pagesubTitle = 'Claim Submissions';
  }

  ngOnInit() {
    this.pageTitle = 'Getting Reimbursed';
    this.summaryItems = [
      {
        category: 'card',
        type: 'donutWithTrend',
        title: 'Claims Paid',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'up',
          data: '+2.3%'
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        category: 'card',
        type: 'donutWithTrend',
        title: 'Total Calls',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'down',
          data: '-2.3%'
        },
        timeperiod: 'Rolling 12 Months'
      }
    ];
  }
}
