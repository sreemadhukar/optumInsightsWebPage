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
  timePeriod = 'Last 12 months';
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
      this.loading = false;
      this.overturnItem = appealsRateData[0];
      this.reason = appealsRateData[1];
    });
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
