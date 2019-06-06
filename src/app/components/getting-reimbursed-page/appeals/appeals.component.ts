import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-appeals',
  templateUrl: './appeals.component.html',
  styleUrls: ['./appeals.component.scss']
})
export class AppealsComponent implements OnInit {
  summaryItems: any;
  pageTitle: String = '';
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  timePeriod = 'Last 6 months';
  subscription: any;
  overturnItem: any;
  overturnReasonItem: any;
  reason: any;

  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private checkStorage: StorageService
  ) {
    this.pageTitle = 'Claims Appeals';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[3].data;
      this.currentTabTitle = this.summaryItems[3].title;
    });

    this.overturnItem = [{}];
    this.overturnItem = this.gettingReimbursedSharedService.getAppealsOverturnedMockData();
    this.overturnReasonItem = [{}];
    //  this.overturnReasonItem = this.gettingReimbursedSharedService.getOverturnReasonsMock();
    this.reason = [];
    /* this.reason.type = 'bar chart';
    this.reason.graphValues = [30, 40 ] ;
    this.reason.color =  ['#3381FF', '#FFFFFF', '#E0E0E0'];
    this.reason.gdata = ['card-inner', 'appealsOverturnedReason'];*/

    const val1 = [30, 60, 80, 20, 10];
    const val2 = [40, 10, 10, 50, 60];
    const btitle = ['Notifications/ Authorizations', 'Referrals', 'Claims Processing', 'Timely Filing', 'Audit Review'];
    const bvalue = ['22 %', '19%', '16%', '12%', '5%'];
    for (let i = 0; i <= 4; i++) {
      this.reason.push({
        type: 'bar chart',
        graphValues: [val1[i], val2[i]],
        barText: btitle[i],
        barValue: bvalue[i],
        color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
        gdata: ['app-card-structure', 'appealsOverturnedReason']
      });
    }
    console.log(this.reason);
  }
}
