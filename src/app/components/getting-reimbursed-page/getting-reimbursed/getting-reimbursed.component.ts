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
        category: 'medium-card',
        type: 'star',
        title: 'Medicare & Retirement Average Star Rating',
        data: {
          graphValues: [2.34],
          centerNumber: 54.3,
          color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
          gdata: ['card-inner', 'pcorCardD3Star']
        },
        sdata: null,
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donut',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut']
        },
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donut',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut']
        },
        sdata: {
          sign: 'down',
          data: '-1.3%'
        },
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donutWithTrend',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut'],
          sdata: [
            {
              sign: 'down',
              data: '-1.3%'
            }
          ]
        },
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donutWithTrend',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut'],
          sdata: [
            {
              sign: 'down',
              data: '-1.3%'
            }
          ]
        },
        labels: ['Medicare', 'Retirement'],
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donutWithTrendWithFooter',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut'],
          sdata: [
            {
              sign: 'down',
              data: '-1.3%'
            }
          ]
        },
        labels: ['Medicare', 'Retirement'],
        footerInformation: [
          {
            Admin: 26,
            Clinical: 27
          }
        ],
        timeperiod: 'Timeperiod - Rolling 6 Months'
      },
      {
        category: 'medium-card',
        type: 'donutWithTrendAdditionalInformation',
        title: 'Claims Non-Payment Rate',
        data: {
          graphValues: [0.4, 1 - 0.4],
          centerNumber: '50.4%',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfServiceCardD3Donut'],
          sdata: [
            {
              sign: 'down',
              data: '-1.3%'
            }
          ]
        },
        additionalInformation: [
          {
            AdminStandard: 3,
            Urgent: 18
          }
        ],
        timeperiod: 'Timeperiod - Rolling 6 Months'
      }
    ];
  }
}
