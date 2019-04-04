import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  items: Array<Object> = [{}];
  private pageTitle: String = '';
  private pagesubTitle: String = '';
  constructor(private overviewsrc: OverviewSharedService) {
    this.items = [
      {
        category: 'donutWithTrend',
        titleCard: 'Claims Paid',
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
      }
    ];
  }
  ngOnInit() {
    this.overviewsrc.getOverviewData();
  }
}
