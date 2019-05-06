import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {
  pageTitle: String = '';
  previousSelected: any = 0;
  selfServiceItems: Array<Object> = [{}];
  timeFrame: String = '';
  tabOptions: Array<Object> = [];
  selectedItemId: Number = 0;
  tabOptionsTitle: Array<String> = [];
  heightSmallBarChart: Number = 140;
  widthSmallBarChart: Number = 240;
  callCostChartData: Object;
  callCostReduceYourCost: String = '';
  callCostCallIn90days: String = '';
  callCostReduceCostValue: String = '';
  callCostCallIn90daysValue: String = '';
  callCostOperatingData: any = {};

  constructor() {
    this.pageTitle = 'Self Service';
    this.timeFrame = 'Time Period - Time Period';
    this.callCostReduceYourCost = 'Reduce your costs by:';
    this.callCostCallIn90days = 'Calls in last 90 days:';
    this.tabOptionsTitle = ['Total Costs', 'Claims Status', 'Eligibility & Benefits', 'Prior Authorizations'];
    this.callCostOperatingData = [
      {
        title: 'Total Costs',
        callCostReduceCostValue: '$32K',
        callCostCallIn90daysValue: '13,916',
        data: {
          chartData: [
            { labelsRight: '40 hours/day', values: 40, metricName: 'Phone' },
            { labelsRight: '25 hours/day', values: 25, metricName: 'Self Service' }
          ],
          value: '15 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'callCostOperating1']
        }
      },
      {
        title: 'Claims Status',
        callCostReduceCostValue: '$12K',
        callCostCallIn90daysValue: '23,916',
        data: {
          chartData: [
            { labelsRight: '50 hours/day', values: 50, metricName: 'Phone' },
            { labelsRight: '10 hours/day', values: 45, metricName: 'Self Service' }
          ],
          value: '5 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'callCostOperating2']
        }
      },
      {
        title: 'Eligibility & Benefits',
        callCostReduceCostValue: '$32K',
        callCostCallIn90daysValue: '13,916',
        data: {
          chartData: [
            { labelsRight: '60 hours/day', values: 60, metricName: 'Phone' },
            { labelsRight: '15 hours/day', values: 15, metricName: 'Self Service' }
          ],
          value: '45 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'callCostOperating3']
        }
      },
      {
        title: 'Prior Authorizations',
        callCostReduceCostValue: '$22K',
        callCostCallIn90daysValue: '3,916',
        data: {
          chartData: [
            { labelsRight: '30 hours/day', values: 30, metricName: 'Phone' },
            { labelsRight: '15 hours/day', values: 15, metricName: 'Self Service' }
          ],
          value: '15 hours/day',
          color: ['#80B0FF', '#3381FF'],
          gdata: ['card-inner', 'callCostOperating4']
        }
      }
    ];
  }

  matOptionClicked(i: number, event: any) {
    this.callCostChartData = {};
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    myTabs[this.previousSelected].classList.remove('active');
    event.target.classList.add('active');
    this.previousSelected = i;
    this.callCostChartData = this.callCostOperatingData[i].data;
    this.callCostReduceCostValue = this.callCostOperatingData[i].callCostReduceCostValue;
    this.callCostCallIn90daysValue = this.callCostOperatingData[i].callCostCallIn90daysValue;
  }

  ngOnInit() {
    this.callCostChartData = this.callCostOperatingData[0].data;
    this.callCostReduceCostValue = this.callCostOperatingData[0].callCostReduceCostValue;
    this.callCostCallIn90daysValue = this.callCostOperatingData[0].callCostCallIn90daysValue;

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
  } // ngOnit funtion ends here
}
