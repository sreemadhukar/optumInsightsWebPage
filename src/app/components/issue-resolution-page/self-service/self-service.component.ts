import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {
  pageTitle: String = '';
  selfServiceItems: Array<Object> = [{}];
  timeFrame: String = '';
  tabOptions: Array<Object> = [];
  selectedItemId: Number = 0;
  tabOptionsTitle: Array<String> = [];
  heightSmallBarChart: Number = 140;
  widthSmallBarChart: Number = 240;
  callCostOperating: Object = {};
  constructor() {
    this.pageTitle = 'Self Service';
    this.timeFrame = 'Time Period - Time Period';
    this.tabOptionsTitle = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
  }
  matOptionClicked(i: any, event: any) {
    this.selectedItemId = i;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    event.target.classList.add('active');
  }

  ngOnInit() {
    this.selfServiceItems = [
      {
        category: 'app-card',
        type: 'donut',
        title: 'Self-Service Adoption Rate',
        data: {
          graphValues: [93, 0],
          centerNumber: '93 %',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'selfAdoptionRate'],
          sdata: {
            sign: 'down',
            data: '-1.3%'
          }
        },
        timeperiod: this.timeFrame
      },
      {
        category: 'app-card',
        type: 'donut',
        title: 'LINK & EDI to Call Ratio',
        data: {
          graphValues: [97, 3],
          centerNumber: '97 %',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'linkAndEdiCallRatio'],
          sdata: {
            sign: 'up',
            data: '+1.3%'
          }
        },
        timeperiod: this.timeFrame
      },
      {
        category: 'app-card',
        type: 'donut',
        title: 'Paperless Delivery',
        data: {
          graphValues: [15, 85],
          centerNumber: '15 %',
          color: ['#3381FF', '#F5F5F5'],
          gdata: ['card-inner', 'paperlessDelivery'],
          sdata: {
            sign: 'down',
            data: '-3.7%'
          }
        },
        timeperiod: this.timeFrame
      },
      {
        category: 'app-card',
        type: 'small-bar-chart',
        title: "Save Your Staff's Time by",
        data: {
          chartData: [
            { labelsRight: '8 hours/day', values: 8, metricName: 'Phone' },
            { labelsRight: '2 hours/day', values: 2, metricName: 'Self Service' }
          ],
          value: '6 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'staffTimeSave']
        },
        timeperiod: this.timeFrame
      },
      {
        category: 'app-card',
        type: 'small-bar-chart',
        title: 'Reduce Claim Processing Time by',
        data: {
          chartData: [
            { labelsRight: '22 days', values: 22, metricName: 'Phone' },
            { labelsRight: '5 days', values: 5, metricName: 'Self Service' }
          ],
          value: '13 days',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'reduceClaimTime']
        },
        timeperiod: this.timeFrame
      },
      {
        category: 'app-card',
        type: 'small-bar-chart',
        title: 'Reduce Reconsideration Processing by:',
        data: {
          chartData: [
            { labelsRight: '60 hours/day', values: 60, metricName: 'Phone' },
            { labelsRight: '15 hours/day', values: 15, metricName: 'Self Service' }
          ],
          value: '45 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'reduceProcessing']
        },
        timeperiod: this.timeFrame
      }
    ];
    this.callCostOperating = {
      category: 'app-card',
      type: 'small-bar-chart',
      data: {
        chartData: [
          { labelsRight: '60 hours/day', values: 60, metricName: 'Phone' },
          { labelsRight: '15 hours/day', values: 15, metricName: 'Self Service' }
        ],
        value: '45 hours/day',
        color: ['#80B0FF', '#3381FF'],
        gdata: ['card-inner', 'callCostOperating']
      },
      timeperiod: this.timeFrame
    };
  } // ngOnit funtion ends here
}
