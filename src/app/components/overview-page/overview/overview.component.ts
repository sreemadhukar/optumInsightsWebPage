import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public sampleDonut: any = {};
  public sampleStar: any = {};
  /*
   this.sampleDonut.chartId = 'sampleDonutChart';
   this.sampleDonut.chartData = [
   { name: 'Commercial', value: 5 },
   { name: 'Medicaid', value: 5 },
   { name: 'Medicare', value: 5 }
   ];
   this.sampleDonut.generalData = [
   {
   parentDiv: 'sampleDonutChart',
   color1: 'blue',
   color2: 'green',
   color3: 'red',
   type: 'arc-padding',
   amount: '$1500'
   }
   ];

   this.sampleStar.chartId = 'sampleStarChart';
   this.sampleStar.chartData = [{ name: 'Commercial', number: 5 }];
   this.sampleStar.generalData = [
   {
   parentDiv: 'sampleStarChart'

   }
   ];

  */

  overviewItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(private overviewsrc: OverviewSharedService) {
    this.pagesubTitle = 'Your Insights at a glance.';
  }
  ngOnInit() {
    this.overviewsrc.getOverviewData();
    this.userName = 'Anne';
    this.pageTitle = 'Hello, ' + this.userName + '.';
    this.overviewItems = [
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
        chartData: [{ name: 'Commercial', value: 5 }, { name: 'Medicaid', value: 5 }, { name: 'Medicare', value: 5 }],
        generalData: [
          {
            parentDiv: 'sampleDonutChart'
          }
        ],
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
        category: 'starRating',
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
}
