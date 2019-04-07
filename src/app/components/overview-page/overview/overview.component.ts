import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(private overviewsrc: OverviewSharedService) {
    this.pagesubTitle = 'Your Insights at a glance.';
  }
  ngOnInit() {
    this.overviewsrc
      .getOverviewData()
      .then(data => console.log(data))
      .catch(reason => console.log(reason.message));
    this.userName = 'Anne';
    this.pageTitle = 'Hello, ' + this.userName + '.';
    this.overviewItems = [
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
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
        timeperiod: 'Timeperiod - Rolling 12 Months'
      },
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
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
        timeperiod: 'Timeperiod - Rolling 12 Months'
      },
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'down',
          data: '-0.3%'
        },
        timeperiod: 'Timeperiod - Rolling 12 Months'
      },
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'up',
          data: '+4.3%'
        },
        timeperiod: 'Timeperiod - Rolling 12 Months'
      },
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'down',
          data: '-8.3%'
        },
        timeperiod: 'Timeperiod - Rolling 12 Months'
      },
      {
        category: 'small-cards',
        type: 'donutWithTrend',
        title: 'Claims Yield',
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
        timeperiod: 'Timeperiod - Rolling 12 Months'
      }
    ];
  }
}
