import { Component, OnInit } from '@angular/core';
import { SelfSharedService } from '../../../shared/issue-resolution/self-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
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

  toggleCallsOperating: Boolean = true;
  callCostChartData: Object;
  callCostReduceYourCost: String = '';
  callCostCallIn90days: String = '';
  callCostReduceCostValue: String = '';
  callCostCallIn90daysValue: String = '';
  callCostOperatingData: any = {};
  disBarGraphCallsCost: Boolean = false;

  subscription: any;

  constructor(
    private selfServiceSrc: SelfSharedService,
    private checkStorage: StorageService,
    private session: SessionService
  ) {
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

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  matOptionClicked(i: number, event: any) {
    this.callCostChartData = {};
    this.disBarGraphCallsCost = false;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    myTabs[this.previousSelected].classList.remove('active');
    event.target.classList.add('active');
    this.previousSelected = i;
    this.callCostChartData = this.callCostOperatingData[i].data;
    this.callCostReduceCostValue = this.callCostOperatingData[i].callCostReduceCostValue;
    this.callCostCallIn90daysValue = this.callCostOperatingData[i].callCostCallIn90daysValue;
    this.disBarGraphCallsCost = true;
  }

  ngOnInit() {
    this.toggleCallsOperating = true;

    this.selfServiceSrc
      .getSelfServiceData()
      .then(data => {
        this.selfServiceItems = data[0];
        console.log('Original data', this.selfServiceItems);
      })
      .catch(reason => console.log('Self Service Page Service Error ', reason));

    this.disBarGraphCallsCost = true;
    this.callCostChartData = this.callCostOperatingData[0].data;
    this.callCostReduceCostValue = this.callCostOperatingData[0].callCostReduceCostValue;
    this.callCostCallIn90daysValue = this.callCostOperatingData[0].callCostCallIn90daysValue;
  } // ngOnit funtion ends here
}
