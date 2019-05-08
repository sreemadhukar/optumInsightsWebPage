import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';

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
  timePeriod = 'Last 6 Months';

  constructor(private gettingReimbursedSharedService: GettingReimbursedSharedService) {
    this.pageTitle = 'Claims Appeals';
  }

  ngOnInit() {
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[3].data;
      this.currentTabTitle = this.summaryItems[3].title;
      console.log(this.currentSummary);
    });
  }
}
