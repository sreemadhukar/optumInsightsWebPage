import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  items: Array<Object> = [{}];
  private pageTitle: String = '';
  private pagesubTitle: String = '';

  constructor() {
    this.pageTitle = 'Hello, Anne.';
    this.pagesubTitle = 'Your Insights at a glance.';
  }

  ngOnInit() {
    this.items = [
      {
        category: 'donutWithTrend',
        titleCard: 'Claims Paid',
        timePeriod: [],
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
        titleCard: 'Prior Authorization Approval',
        timePeriod: 'TimePeriod - TimePeriod',
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
        titleCard: 'Self Service Adoption Rate',
        timePeriod: [],
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
        titleCard: 'Claims Yeild',
        timePeriod: 'TimePeriod - TimePeriod',
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
        titleCard: 'Medicare Star Rating',
        timePeriod: [],
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
        titleCard: 'Total Calls',
        timePeriod: 'TimePeriod - TimePeriod',
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
        titleCard: 'Claims Paid',
        timePeriod: [],
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
        titleCard: 'Prior Authorization Approval',
        timePeriod: 'TimePeriod - TimePeriod',
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
        titleCard: 'Claims Paid',
        timePeriod: [],
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
        titleCard: 'Prior Authorization Approval',
        timePeriod: 'TimePeriod - TimePeriod',
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
        titleCard: 'Claims Paid',
        timePeriod: [],
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
        titleCard: 'Prior Authorization Approval',
        timePeriod: 'TimePeriod - TimePeriod',
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
