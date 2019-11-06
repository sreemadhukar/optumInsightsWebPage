import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from '../../../../../src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { TopRowAdvOverviewSharedService } from '../../../shared/advocate/top-row-adv-overview-shared.service';
import { GlossaryMetricidService } from '../../../shared/glossary-metricid.service';
import { NonPaymentSharedService } from '../../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { OverviewAdvocateSharedService } from '../../../shared/advocate/overview-advocate-shared.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { AppealsData } from '../appeals-data';
import { GeneralData } from '../general-data';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-overview-advocate',
  templateUrl: './overview-advocate.component.html',
  styleUrls: ['./overview-advocate.component.scss']
})
export class OverviewAdvocateComponent implements OnInit {
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  topRowItems: any;
  timePeriod: string;
  lob: string;
  trendTitle = 'Non-Payment Trend';
  taxID: Array<string>;
  topRowMockCards: any;
  subscription: any;
  claimsSubmitted: any;
  claimsPaid: any;
  claimsNotPaid: any;
  paymentCards: Array<Object>;
  paymentLoading: boolean;
  monthlyLineGraph: any = [{}];
  trendMonthDisplay = false;
  trendTitleForClaims = 'Claims Appeals Submitted';
  appealsloading: boolean;
  appealsmockCards: any;
  totalAppeals: any;
  adminAppeals: any;
  clinicalAppeals: any;
  appealsLineGraph: AppealsData;
  mi: any;
  cs: any;
  ei: any;
  other: any;
  routhPath: string;
  appealsLineGraphloading: boolean;
  appealsLineGraphData: any;
  callsLineGraphLoading: boolean;
  trendTitleForCalls = 'Calls by Call Type';
  totalCalls: any;
  callsLoading: boolean;
  callsLineGraphData: any;

  constructor(
    private checkStorage: StorageService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private common: CommonUtilsService,
    private topRowService: TopRowAdvOverviewSharedService,
    private nonPaymentService: NonPaymentSharedService,
    public MetricidService: GlossaryMetricidService,
    public overviewAdvocateSharedService: OverviewAdvocateSharedService,
    private glossaryExpandService: GlossaryExpandService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.pageTitle = 'Welcome, ' + this.userName;
    this.pagesubTitle = 'Your Insights at a glance.';

    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
  }

  paymentData(payload) {
    this.paymentLoading = true;
    this.topRowMockCards = [{}, {}, {}];

    this.topRowService
      .getPaymentShared(payload)
      .then(paymentData => {
        this.paymentCards = JSON.parse(JSON.stringify(paymentData));
        this.paymentLoading = false;
      })
      .catch(reason => {
        this.paymentLoading = false;
        console.log('Adovate Overview page Payment', reason);
      });
  }

  appealsLeftData(payload) {
    this.appealsloading = true;
    this.appealsmockCards = [{}, {}, {}, {}];

    this.overviewAdvocateSharedService.getAppealsLeftShared(payload).then(appealsLeftData => {
      let AppealsLeftData: any;
      AppealsLeftData = appealsLeftData;
      if (AppealsLeftData[0].LineOfBusiness != null && AppealsLeftData[0].LineOfBusiness) {
        this.totalAppeals = AppealsLeftData[0].LineOfBusiness.ALL.AdminAppeals;
        this.adminAppeals = AppealsLeftData[0].LineOfBusiness.ALL.AdminAppeals;
        this.clinicalAppeals = AppealsLeftData[0].LineOfBusiness.ALL.ClinicalAppeals;

        if (AppealsLeftData[0].LineOfBusiness.MedicareAndRetirement) {
          this.mi =
            AppealsLeftData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals +
            AppealsLeftData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals;
        }

        if (AppealsLeftData[0].LineOfBusiness.CommunityAndState) {
          this.cs =
            AppealsLeftData[0].LineOfBusiness.CommunityAndState.AdminAppeals +
            AppealsLeftData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals;
        }

        if (AppealsLeftData[0].LineOfBusiness.EmployerAndIndividual) {
          this.ei =
            AppealsLeftData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals +
            AppealsLeftData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals;
        }

        if (AppealsLeftData[0].LineOfBusiness.Other) {
          this.other =
            AppealsLeftData[0].LineOfBusiness.Other.AdminAppeals +
            AppealsLeftData[0].LineOfBusiness.Other.ClinicalAppeals;
        }
        this.appealsloading = false;
      }
    });
  }

  appealsTrendByMonthData(payload) {
    this.appealsLineGraphData = {};
    this.overviewAdvocateSharedService
      .getAppealsTrendByMonthShared(payload)
      .then(appealsTrendData => {
        this.appealsLineGraphloading = false;
        if (
          (appealsTrendData['M&R'].length ||
            appealsTrendData['C&S'].length ||
            appealsTrendData['E&I'].length ||
            appealsTrendData['Other'].length) === 0
        ) {
          this.appealsLineGraphData = {
            category: 'large-card',
            type: 'donut',
            status: 404,
            title: 'Claims Appeals Submitted',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmittedTrend,
            data: null,
            timeperiod: null
          };
        } else {
          this.appealsLineGraphData = appealsTrendData;
          this.appealsLineGraph = new AppealsData(appealsTrendData, GeneralData, 'appeals-trend-block');
          console.log(this.appealsLineGraph);
        }
      })
      .catch(err => {
        this.appealsLineGraphloading = false;
      });
  }

  totalCallsData(payload) {
    this.callsLoading = true;
    this.overviewAdvocateSharedService
      .getTotalCallsShared(payload)
      .then(totalCallsData => {
        if (totalCallsData[0] == null) {
          this.callsLoading = false;
          this.callsLineGraphData = {
            category: 'large-card',
            type: 'donut',
            status: 404,
            title: this.trendTitleForCalls,
            MetricID: this.MetricidService.MetricIDs,
            data: null,
            timeperiod: null
          };
        } else {
          let callsLeftData;
          callsLeftData = totalCallsData;
          this.totalCalls = this.common.nondecimalFormatter(callsLeftData[0].CallVolByQuesType.Total);
          this.callsLoading = false;
        }
      })
      .catch(err => {
        this.callsLoading = false;
      });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'overviewAdvocatePage' });
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.checkStorage.emitEvent('overviewPage');
    this.paymentData(this.createPayloadService.payload);
    this.appealsLeftData(this.createPayloadService.payload);
    this.appealsTrendByMonthData(this.createPayloadService.payload);
    this.totalCallsData(this.createPayloadService.payload);
    this.appealsLineGraphloading = true;
    // this.callsLineGraphLoading = true;
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Welcome, ' + this.userName;
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
    // Need to remove once filters is done
    // This is for line graph
    // this.nonPaymentService.sharedTrendByMonth().then(trendData => {
    //   if (trendData === null) {
    //     this.trendMonthDisplay = false;
    //     this.monthlyLineGraph = {
    //       category: 'large-card',
    //       type: 'donut',
    //       status: 404,
    //       title: 'Claims Non-Payment Trend',
    //       MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentTrend,
    //       data: null,
    //       timeperiod: null
    //     };
    //   } else {
    //     this.monthlyLineGraph.chartData = trendData;
    //     this.trendMonthDisplay = true;
    //   }
    // });

    this.monthlyLineGraph.generalData2 = [];
    this.monthlyLineGraph.chartData2 = [];
  }

  helpIconClick(title) {
    if (title === 'Non-Payment Trend') {
      this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs.ClaimsNonPaymentTrend);
    }
    this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs);
  }
}
