import { Component, OnInit } from '@angular/core';
import { SelfSharedService } from '../../../shared/issue-resolution/self-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';

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
  widthSmallBarChart: Number = 230;
  customSmallBarChart: Boolean = true;
  toggleCallsOperating: Boolean = false;
  callCostChartData: any;
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
    private session: SessionService,
    private glossaryExpandService: GlossaryExpandService
  ) {
    this.pageTitle = 'Self Service';
    this.callCostReduceYourCost = 'Reduce your costs by:';
    this.callCostCallIn90days = 'Calls in last 90 days:';

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  matOptionClicked(i: number, event: any) {
    this.disBarGraphCallsCost = false;
    this.callCostChartData = null;
    this.toggleCallsOperating = false;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    myTabs[this.previousSelected].classList.remove('active');
    event.target.classList.add('active');
    this.previousSelected = i;
    this.callCostChartData = this.callCostOperatingData[i].data;
    this.callCostReduceCostValue = this.callCostOperatingData[i].callCostReduceCostValue;
    this.callCostCallIn90daysValue = this.callCostOperatingData[i].callCostCallIn90daysValue;
    console.log('Change', this.callCostChartData);
    this.toggleCallsOperating = true;
    this.disBarGraphCallsCost = true;
  }

  ngOnInit() {
    this.disBarGraphCallsCost = true;
    this.selfServiceSrc
      .getSelfServiceData()
      .then(selfServiceData => {
        this.selfServiceItems = selfServiceData[0];
        this.callCostOperatingData = selfServiceData[1];
        if (this.callCostOperatingData.length === 0) {
          this.toggleCallsOperating = false;
        }
        if (this.callCostOperatingData.length) {
          for (let i = 0; i < this.callCostOperatingData.length; i++) {
            this.tabOptionsTitle.push(this.callCostOperatingData[i].title);
          }
          this.callCostChartData = this.callCostOperatingData[0].data;
          this.callCostReduceCostValue = this.callCostOperatingData[0].callCostReduceCostValue;
          this.callCostCallIn90daysValue = this.callCostOperatingData[0].callCostCallIn90daysValue;
          this.timeFrame = selfServiceData[0][0].timeperiod;
          this.toggleCallsOperating = true;
        }
      })
      .catch(reason => console.log('Self Service Page Service Error ', reason));
  } // ngOnit funtion ends here
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
