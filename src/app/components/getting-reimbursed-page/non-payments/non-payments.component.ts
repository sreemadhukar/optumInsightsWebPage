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
  EventEmitter,
  Input
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { GlossaryMetricidService } from '../../../shared/glossary-metricid.service';
import { NonPaymentSharedService } from '../../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { NgRedux, select } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('180ms ease-out')),
      transition('default => rotated', animate('180ms ease-in'))
    ])
  ]
})
export class NonPaymentsComponent implements OnInit, AfterViewChecked {
  @Input() printStyle;
  title = ' Top Reasons for Claims Non-Payment';
  trendTitle = 'Claims Non-Payment Trend';
  section: any = [];
  timePeriod: string;
  // lob: string;
  // taxID: Array<string>;
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
    public MetricidService: GlossaryMetricidService,
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
    private nonPaymentService: NonPaymentSharedService,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService,
    private common: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('nonPaymentsPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
      this.common.urlResuseStrategy();
    });
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
    iconRegistry.addSvgIcon(
      'carrot',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/keyboard_arrow_down-24px.svg')
    );

    this.pageTitle = 'Claims Non-Payments*';
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'nonPaymentsPage' });
    this.nonPaymentData1 = [];
    this.loadingTopReasons = true;
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.gettingReimbursedSharedService.getTins().then(tins => {});
    this.loadingOne = false;
    this.mockCardOne = [{}];
    this.loadingTwo = false;
    this.mockCardTwo = [{}];

    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    this.nonPaymentService.getNonPayment(this.createPayloadService.payload).then(
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
    this.nonPaymentService.getNonPaymentCategories(this.createPayloadService.payload).then(
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
            MetricID: this.MetricidService.MetricIDs.TopReasonsforClaimsNonPayment,
            data: null,
            timeperiod: null
          };
        }
      },
      error => {
        this.loadingTopReasons = false;
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
    this.nonPaymentService.sharedTrendByMonth(this.createPayloadService.payload).then(trendData => {
      if (trendData === null) {
        this.trendMonthDisplay = false;
        this.monthlyLineGraph = {
          category: 'large-card',
          type: 'donut',
          status: 404,
          title: 'Claims Non-Payment Trend',
          MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentTrend,
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
    if (title === 'Top Reasons for Claims Non-Payment') {
      this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs.TopReasonsforClaimsNonPayment);
    }
    if (title === 'Claims Non-Payment Trend') {
      this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs.ClaimsNonPaymentTrend);
    }
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
}
