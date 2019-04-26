import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit {
  summaryItems: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  tabId: Number = 0;
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  tabOptions: Array<String> = [];
  selectedItemId: Number = 0;

  constructor(private gettingReimbursedSharedService: GettingReimbursedSharedService) {
    this.pageTitle = 'Getting Reimbursed';
    this.currentTabTitle = '';
    this.tabOptions = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
  }

  matOptionClicked(i: any, event: any) {
    console.log('option clicked', this.selectedItemId);
    this.selectedItemId = i;
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    event.target.classList.add('active');
  }
  ngOnInit() {
    this.selectedItemId = 0;
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.summaryItems = JSON.parse(JSON.stringify(completeData));
        console.log('SUmmary Item', this.summaryItems);
        this.currentSummary = this.summaryItems[0].data;
        this.currentTabTitle = this.summaryItems[0].title;
        console.log(this.currentSummary);
      })
      .catch(reason => console.log(reason.message));
  }
}
