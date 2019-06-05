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
  loading: boolean;
  mockCards: any;
  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private checkStorage: StorageService
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

    this.overturnItem = [{}];
    // this.overturnItem = this.gettingReimbursedSharedService.getAppealsOverturnedMockData();
  }
}
