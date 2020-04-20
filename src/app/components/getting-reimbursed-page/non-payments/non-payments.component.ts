import { TopClaimsSharedService } from 'src/app/shared/getting-reimbursed/non-payments/top-claims-shared.service';
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
import { TopReasonsEmitterService } from '../../../shared/getting-reimbursed/non-payments/top-reasons-emitter.service';
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
  hideAllObjects: boolean;
  viewClaimsByFilter: string;
  title = 'Top Reasons for Claims Non-Payment';
  trendTitle = 'Claims Non-Payment Trend';
  section: any = [];
  timePeriod: string;
  timePeriodTopReaons: string;
  timePeriodLineGraph: string;
  // lob: string;
  // taxID: Array<string>;
  @Input() printStyle;
  printRoute: String;
  @Output() filterIconClicked = new EventEmitter();
  subscription: any;
  pageTitle: String = '';
  pageSubTitle: String = '';
  printpageSubTitle: String = '';
  subtitle: any;
  nonPaymentData1: Array<Object> = [{}];
  currentTabTitle: String = '';
  monthlyLineGraph: any = [{}];
  loadingTopReasons: boolean;
  reasonWithData: any;
  topReasonsCategoryDisplay = false;
  trendMonthDisplay = false;
  type: any;
  loadingOne: boolean;
  mockCardOne: any;
  loadingTwo: boolean;
  mockCardTwo: any;
  barChartsArray: any;
  mockCards: any;
  loading: boolean;
  @Input() data;
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
    private common: CommonUtilsService,
    private reasonsEmitter: TopReasonsEmitterService,
    private topClaimsSharedService: TopClaimsSharedService
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
    this.printRoute = '/GettingReimbursed/NonPayments/print-nonpayments';
    this.pageTitle = 'Claims Non-Payments';
    this.printpageSubTitle = 'Getting Reimbursed - Claims Non-Payments';
    this.pageSubTitle = 'Note: Claims non-payment metrics are calculated based on billed charges.';
    /* this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    }); */
  }

  ngOnInit() {
    if (this.router.url.includes('print-')) {
      this.subtitle = true;
      this.printStyle = true;
      this.pageTitle = this.session.getHealthCareOrgName();
    }
    this.mockCards = [{}];
    this.loading = true;
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'nonPaymentsPage' });
    this.nonPaymentData1 = [];
    this.loadingTopReasons = true;
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.viewClaimsByFilter = this.createPayloadService.payload['viewClaimsByFilter'];
    this.gettingReimbursedSharedService.getTins().then(() => {});
    this.loadingOne = false;
    this.mockCardOne = [{}];
    this.loadingTwo = false;
    this.mockCardTwo = [{}];

    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    this.nonPaymentService.getNonPayment(this.createPayloadService.payload).then(
      (nonPayment: any) => {
        this.loading = false;
        this.nonPaymentData1 = nonPayment;
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
        } else {
          this.topReasonsCategoryDisplay = true;
          this.barChartsArray = topCategories;
          this.reasonsWithSubReasons(topCategories);
          // to initialize the data required in view-top-claims data
          this.reasonWithData = this.reasonsWithSubReasons(topCategories);
          this.timePeriodTopReaons = this.barChartsArray[0].timePeriod;
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
        width: 961,
        backgroundColor: 'null',
        barGraphNumberSize: 18,
        barColor: '#196ECF',
        parentDiv: 'non-payment-trend-block',
        tooltipBoolean: true,
        hideYAxis: false,
        yAxisUnits: '$'
      }
    ];

    this.monthlyLineGraph.chartData = [];
    this.trendMonthDisplay = false;
    // This is for line graph
    this.nonPaymentService.sharedTrendByMonth(this.createPayloadService.payload).then((data: any) => {
      const trendData = data;
      if (trendData == null) {
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
        this.timePeriodLineGraph = trendData.timePeriod;
        this.monthlyLineGraph.chartData = trendData.data;
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
  subReasonClicked(value: string, index: number) {
    const routetoThis = '/GettingReimbursed/ViewTopClaims';
    const subReasonSelected = this.reasonWithData
      .filter(item => item.mainReason === value)
      .map(item => item.subReason[index]);
    const temp = {
      fullData: this.reasonWithData,
      reasonSelected: value,
      subReason: subReasonSelected[0]
    };
    this.reasonsEmitter.sendData = temp;
    this.router.navigateByUrl('/GettingReimbursed/ViewTopClaims');
  }
  public reasonsWithSubReasons(data) {
    const reasonWithSubData: any = [];
    for (let i = 0; i < data.length; i++) {
      const temp = {
        mainReason: data[i].title,
        subReason: data[i].top5.map(item => item.text)
      };
      reasonWithSubData.push(temp);
    }
    return reasonWithSubData;
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
