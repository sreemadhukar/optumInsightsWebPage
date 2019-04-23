import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';

@Component({
  selector: 'app-getting-reimbursed',
  templateUrl: './getting-reimbursed.component.html',
  styleUrls: ['./getting-reimbursed.component.scss']
})
export class GettingReimbursedComponent implements OnInit, AfterViewInit {
  summaryItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private gettingReimbursedSharedService: GettingReimbursedSharedService
  ) {
    this.pagesubTitle = 'Claim Submissions';
    this.pageTitle = 'Getting Reimbursed';
  }

  ngOnInit() {
    this.gettingReimbursedSharedService
      .getGettingReimbursedData()
      .then(data => {
        this.summaryItems = JSON.parse(JSON.stringify(data));

        console.log(this.summaryItems);
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
