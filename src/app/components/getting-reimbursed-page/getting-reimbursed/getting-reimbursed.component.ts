import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';

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
  previousSelected: Number = 0;
  selectedItemId: any = 0;
  tabOptionsTitle: Array<String> = [];
  subscription: any;
  loading: boolean;
  mockCards: any;

  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private filterExpandService: FilterExpandService,
    private router: Router
  ) {
    this.pageTitle = 'Getting Reimbursed';
    this.currentTabTitle = '';
    this.tabOptionsTitle = ['Submission', 'Payments', 'Non-Payments', 'Appeals'];
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }
  matOptionClicked(i: number, event: any) {
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    //    event.target.classList.add('active');
  }
  ngOnInit() {
    this.loading = true;
    this.mockCards = [{}, {}];
    this.selectedItemId = 0;
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(completeData => {
        this.loading = false;
        this.summaryItems = JSON.parse(JSON.stringify(completeData));
        this.currentSummary = this.summaryItems[0].data;
        this.currentTabTitle = this.summaryItems[0].title;
        console.log(this.summaryItems);

        this.tabOptions = [];
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
      .catch(reason => {
        this.loading = false;
        console.log(reason.message);
      });
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
