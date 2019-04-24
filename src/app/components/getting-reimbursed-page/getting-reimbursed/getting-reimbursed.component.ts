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
  constructor(private gettingReimbursedSharedService: GettingReimbursedSharedService) {
    this.pageTitle = 'Getting Reimbursed';
    this.currentTabTitle = '';
    this.tabOptions = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
  }
  matOptionClicked(i: any) {
    console.log('option clicked', i);
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
  }
  ngOnInit() {
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

    window.addEventListener('load', function() {
      // store tabs variable
      /*
      const myTabs = document.querySelectorAll('ul.nav-tabs > li');
      function myTabClicks(tabClickEvent) {
        for (let i = 0; i < myTabs.length; i++) {
          myTabs[i].classList.remove('active');
        }
        const clickedTab = tabClickEvent.currentTarget;
        clickedTab.classList.add('active');
        tabClickEvent.preventDefault();
        let myContentPanes = document.querySelectorAll('.tab-pane');
        for (let i = 0; i < myContentPanes.length; i++) {
          myContentPanes[i].classList.remove('active');
        }
        const anchorReference = tabClickEvent.target;
        var activePaneId = anchorReference.getAttribute('href');
        var activePane = document.querySelector(activePaneId);
        activePane.classList.add('active');
      }
      for (i = 0; i < myTabs.length; i++) {
        myTabs[i].addEventListener('click', myTabClicks);
      }
      */
    });
  }
}
