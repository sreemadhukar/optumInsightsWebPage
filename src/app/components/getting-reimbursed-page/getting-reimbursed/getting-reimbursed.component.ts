import { Component, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

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
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.pagesubTitle = 'Claim Submissions';
  }

  ngOnInit() {
    this.pageTitle = 'Getting Reimbursed';
    this.summaryItems = [
      {
        category: 'card',
        type: 'donutWithTrend',
        title: 'Claims Paid',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'up',
          data: '+2.3%'
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        category: 'card',
        type: 'donutBothLabelTrend',
        title: 'Total Claims Submitted',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'down',
          data: '-2.3%'
        },
        timeperiod: 'Rolling 12 Months'
      }
    ];
  }

  public ngAfterViewInit(): void {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.mat-tab-label') as HTMLElement[];
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'height', 'auto !important');
    });
  }
}
