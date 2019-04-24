import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';

@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit, AfterViewInit {
  summaryItems: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  tabId: Number = 0;
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  tabOptions: Array<String> = [];
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private gettingReimbursedSharedService: GettingReimbursedSharedService
  ) {
    this.pagesubTitle = 'Claim Submissions';
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
  }

  public ngAfterViewInit(): void {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.mat-tab-label') as HTMLElement[];
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'height', 'auto !important');
    });
  }
}
