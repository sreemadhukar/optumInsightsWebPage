import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit {
  overviewItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor() {
    this.pagesubTitle = 'Claim Submissions';
  }

  ngOnInit() {
    this.pageTitle = 'Getting Reimbursed';
    this.overviewItems = [
      {
        category: 'donutWithTrend',
        titleCard: 'Total Claims Submitted',
        timePeriod: 'Rolling 6 months',
        donutColor: [],
        donutText: [
          {
            value: '38.3%'
          }
        ],
        chartData: [],
        generalData: [],
        trend: [
          {
            trendNature: 'up',
            value: 28
          }
        ]
      },
      {
        category: 'donutWithTrend',
        titleCard: 'Claims Average Turnaround Time',
        timePeriod: 'Rolling 6 months',
        donutColor: [],
        donutText: [
          {
            value: '38.3%'
          }
        ],
        chartData: [],
        generalData: [],
        trend: [
          {
            trendNature: 'up',
            value: 28
          }
        ]
      }
    ];
  }
}
