import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';

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
  overturn: any;
  overturnItem: Array<Object> = [{}];
  overturnReasonItem: any;
  reason: any;
  title = 'Top Claims Appeals Overturn Reasons';
  loading: boolean;
  mockCards: any;
  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private checkStorage: StorageService,
    private glossaryExpandService: GlossaryExpandService
  ) {
    this.pageTitle = 'Claims Appeals';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.loading = true;
    this.mockCards = [{}, {}];
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.loading = false;
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[3].data;
      this.currentTabTitle = this.summaryItems[3].title;
    });

    this.gettingReimbursedSharedService.getappealsRateAndReasonData().then(appealsRateData => {
      // this.overturn = JSON.parse(JSON.stringify(appealsRateData));
      this.overturnItem = appealsRateData[0];
    });
    //  this.overturnReasonItem = this.gettingReimbursedSharedService.getOverturnReasonsMock();
    this.reason = [];
    /* this.reason.type = 'bar chart';
    this.reason.graphValues = [30, 40 ] ;
    this.reason.color =  ['#3381FF', '#FFFFFF', '#E0E0E0'];
    this.reason.gdata = ['card-inner', 'appealsOverturnedReason'];*/

    const val1 = [30, 60, 80, 20, 10];
    const val2 = [40, 10, 10, 50, 60];
    const btitle = ['Notifications/ Authorizations', 'Referrals', 'Claims Processing', 'Timely Filing', 'Audit Review'];
    const bvalue = ['22 %', '33%', '30%', '10%', '5%'];
    for (let i = 0; i <= 4; i++) {
      this.reason.push({
        type: 'bar chart',
        graphValues: [val1[i], val2[i]],
        barText: btitle[i],
        barValue: bvalue[i],
        color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
        gdata: ['app-card-structure', 'appealsOverturnedReason' + i]
      });
    }
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
