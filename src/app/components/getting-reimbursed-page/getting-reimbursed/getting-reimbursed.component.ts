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
  tabOptions: Array<Object> = [];
  previousSelected: any = 0;
  selectedItemId: any = 0;
  tabOptionsTitle: Array<String> = [];
  constructor(private gettingReimbursedSharedService: GettingReimbursedSharedService) {
    this.pageTitle = 'Getting Reimbursed';
    this.currentTabTitle = '';
    this.tabOptionsTitle = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
  }

  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }
  matOptionClicked(i: number, event: any) {
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    myTabs[this.previousSelected].classList.remove('active');
    this.previousSelected = i;

    event.target.classList.add('active');
  }
  ngOnInit() {
    this.selectedItemId = 0;
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.summaryItems = JSON.parse(JSON.stringify(completeData));
        this.currentSummary = this.summaryItems[0].data;
        this.currentTabTitle = this.summaryItems[0].title;
        console.log(this.currentSummary);

        for (let i = 0; i < 4; i++) {
          const temp = {
            id: i,
            title: this.getTabOptionsTitle(i),
            value1: this.summaryItems[i].data[0].data.centerNumber,
            sdata: {
              sign: this.summaryItems[i].data[0].data.sdata.sign,
              value: this.summaryItems[i].data[0].data.sdata.data
            }
          };
          this.tabOptions.push(temp);
        }
      })
      .catch(reason => console.log(reason.message));
  }
}
