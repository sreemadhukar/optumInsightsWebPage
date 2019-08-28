import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  AfterViewChecked,
  Output,
  EventEmitter
} from '@angular/core';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { NonPaymentSharedService } from '../../../shared/getting-reimbursed/non-payment-shared.service';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NonPaymentsComponent implements OnInit, AfterViewChecked {
  title = 'Top Reasons for Claims Non-Payment';
  trendTitle = 'Claims Non-Payment Trend';
  section: any = [];
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  @Output() filterIconClicked = new EventEmitter();
  subscription: any;
  pageTitle: String = '';
  nonPaymentData1: Array<Object> = [{}];
  currentTabTitle: String = '';
  monthlyLineGraph: any = [{}];
  loadingTopReasons: boolean;

  topReasonsCategoryDisplay = false;
  trendMonthDisplay = false;
  type: any;
  loadingOne: boolean;
  mockCardOne: any;
  loadingTwo: boolean;
  mockCardTwo: any;
  barChartsArray: any;
  /*
  barChartsArray = [
    {
      title: 'Need More Information',
      value: '$2.6M',
      numeric: 2600000,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Auth Notice Ref',
      value: '$999.9K',
      numeric: 999900,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Claims Payment Policy',
      value: '$754.8K',
      numeric: 754800,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Benefit Coverage',
      value: '$354.2K',
      numeric: 354200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Not Categorized',
      value: '$232.2K',
      numeric: 232200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    }
  ];
  */
  constructor(
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    sanitizer: DomSanitizer,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private cdRef: ChangeDetectorRef,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    private filtermatch: CommonUtilsService,
    private nonPaymentService: NonPaymentSharedService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'open',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close-bar',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'asc-sort',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_up-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'desc-sort',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_down-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.pageTitle = 'Claims Non-Payments*';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.nonPaymentData1 = [];
    this.loadingTopReasons = true;
    if (
      this.session.filterObjValue.timeFrame === 'Last 12 Months' ||
      this.session.filterObjValue.timeFrame === '2017' ||
      this.session.filterObjValue.timeFrame === '2018'
    ) {
      this.session.filterObjValue.timeFrame = 'Last 6 Months';
    } // temporary change for claims
    this.timePeriod = this.session.filterObjValue.timeFrame;
    if (this.session.filterObjValue.lob !== 'All') {
      this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    } else {
      this.lob = '';
    }
    if (this.session.filterObjValue.tax.length > 0 && this.session.filterObjValue.tax[0] !== 'All') {
      this.taxID = this.session.filterObjValue.tax;
      if (this.taxID.length > 3) {
        this.taxID = [this.taxID.length + ' Selected'];
      }
    } else {
      this.taxID = [];
    }
    this.gettingReimbursedSharedService.getTins().then(tins => {});
    this.loadingOne = false;
    this.mockCardOne = [{}];
    this.loadingTwo = false;
    this.mockCardTwo = [{}];

    // this.timePeriod = this.session.timeFrame; // uncomment it

    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    this.nonPaymentService.getNonPayment().then(
      nonPayment => {
        this.nonPaymentData1 = JSON.parse(JSON.stringify(nonPayment));
      },
      err => {
        console.log('Non Payment Component Two Donuts', err);
      }
    );
    /** Ends here */

    /** code for Top Categories*/

    this.topReasonsCategoryDisplay = false;
    this.nonPaymentService.getNonPaymentCategories().then(
      topCategories => {
        this.loadingTopReasons = false;
        this.topReasonsCategoryDisplay = true;
        this.barChartsArray = topCategories;
        if (topCategories === null) {
          this.topReasonsCategoryDisplay = false;
          this.barChartsArray = {
            category: 'large-card',
            type: 'donut',
            status: 404,
            title: 'Top Reasons for Claims Non-Payment',
            data: null,
            timeperiod: null
          };
        }
      },
      error => {
        this.topReasonsCategoryDisplay = false;
        this.barChartsArray = null;
        console.log('Non Payment Component Error Top Categories', error);
      }
    );
    /** End code for Top Categories */

    this.monthlyLineGraph.chartId = 'non-payment-trend-block';
    this.monthlyLineGraph.titleData = [{}];
    this.monthlyLineGraph.generalData = [
      {
        width: 500,
        backgroundColor: 'null',
        barGraphNumberSize: 18,
        barColor: '#196ECF',
        parentDiv: 'non-payment-trend-block',
        tooltipBoolean: true,
        hideYAxis: false
      }
    ];

    this.monthlyLineGraph.chartData = [];
    this.trendMonthDisplay = false;
    // This is for line graph
    this.nonPaymentService.sharedTrendByMonth().then(trendData => {
      if (trendData === null) {
        this.trendMonthDisplay = false;
        this.monthlyLineGraph = {
          category: 'large-card',
          type: 'donut',
          status: 404,
          title: 'Claims Non-Payment Trend',
          data: null,
          timeperiod: null
        };
      } else {
        this.monthlyLineGraph.chartData = trendData;
        this.trendMonthDisplay = true;
      }
    });

    this.monthlyLineGraph.generalData2 = [];
    this.monthlyLineGraph.chartData2 = [];
  } // ngOnInit Ends here

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  /** This function is used for collapse of Top Reasons For Non Payment
   * section is an array of boolean variable
   * The functionlaity in html code is like when we click on + and - icon, boolean value of true
   * is pushed in section array.
   * So this function is marking false for all those indexes in the section array except for the
   * clicked one which we captured in the variable x
   */
  reasonsCollapose(x: Number) {
    for (let i = 0; i < this.section.length; i++) {
      if (i !== x) {
        this.section[i] = false;
      }
    }
  }

  sortHeader(event) {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.sort-header-icon') as HTMLElement[];
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'color', '#757588');
    });
    this.type = event.direction;
  }

  ngAfterViewChecked() {
    if (this.type === 'asc') {
      (document.querySelector(
        '.mat-sort-header-sorted > .mat-sort-header-button> .sort-header-asc'
      ) as HTMLElement).style.color = '#2d2d39';
    } else if (this.type === 'desc') {
      (document.querySelector(
        '.mat-sort-header-sorted > .mat-sort-header-button> .sort-header-desc'
      ) as HTMLElement).style.color = '#2d2d39';
    }
    // this.cdRef.detectChanges();
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
  removeFilter(type, value) {
    if (type === 'lob') {
      this.lob = '';
      this.session.store({ timeFrame: this.timePeriod, lob: 'All', tax: this.session.filterObjValue.tax });
    } else if (type === 'tax' && !value.includes('Selected')) {
      this.taxID = this.session.filterObjValue.tax.filter(id => id !== value);
      if (this.taxID.length > 0) {
        this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: this.taxID });
      } else {
        this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: ['All'] });
        this.taxID = [];
      }
    } else if (type === 'tax' && value.includes('Selected')) {
      this.session.store({ timeFrame: this.timePeriod, lob: this.session.filterObjValue.lob, tax: ['All'] });
      this.taxID = [];
    }
  }
}
