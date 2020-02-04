import { Component, OnInit, DoCheck } from '@angular/core';
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
import { CallsTrendData } from '../calls-trend-data';
import { CallsGeneralData } from '../calls-general-data';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-overview-advocate',
  templateUrl: './overview-advocate.component.html',
  styleUrls: ['./overview-advocate.component.scss']
})
export class OverviewAdvocateComponent implements OnInit, DoCheck {
  pageTitle: String;
  pagesubTitle: String;
  userName: String;
  topRowItems: any;
  timePeriod: string;
  timePeriodCalls: string;
  timePeriodPi: string;
  timePeriodNonPayment: string;
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
  PODTitle = 'Payments by Submission';
  appealsloading: boolean;
  appealsmockCards: any;
  totalAppeals: any;
  adminAppeals: any;
  clinicalAppeals: any;
  appealsData: any;
  appealsLineGraph: AppealsData;
  callsTrendLineGraph: CallsTrendData;
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
  callsData: any;
  claimsYieldLoading: boolean;
  downRowMockCards: any;
  claimsYieldCard: Array<Object>;
  pbsLoading: boolean;
  pbsCard: any;
  paperClaims: any;
  electronicClaims: any;
  stackedBarChartData: any = {
    chartId: '',
    chartData: ''
  };
  stackedBarChartLoading: boolean;

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
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
      this.createPayloadService.resetTinNumber('overviewAdvocatePage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
    });
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

  paymentData() {
    this.paymentLoading = true;
    this.topRowMockCards = [{}, {}, {}];

    this.topRowService
      .getPaymentShared(this.createPayloadService.payload)
      .then(paymentData => {
        this.paymentCards = JSON.parse(JSON.stringify(paymentData));
        this.paymentLoading = false;
      })
      .catch(reason => {
        this.paymentLoading = false;
        console.log('Error Adovate Overview page Payment', reason);
      });
  }

  appealsLeftData() {
    this.appealsloading = true;
    this.appealsmockCards = [{}, {}, {}, {}];

    this.overviewAdvocateSharedService.getAppealsLeftShared(this.createPayloadService.payload).then(appealsLeftData => {
      let AppealsLeftData: any;
      AppealsLeftData = appealsLeftData;
      if (AppealsLeftData[0].LineOfBusiness != null && AppealsLeftData[0].LineOfBusiness) {
        this.totalAppeals =
          AppealsLeftData[0].LineOfBusiness.ALL.AdminAppeals + AppealsLeftData[0].LineOfBusiness.ALL.ClinicalAppeals;
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

  appealsTrendByMonthData() {
    this.appealsLineGraphData = {};
    this.overviewAdvocateSharedService
      .getAppealsTrendByMonthShared(this.createPayloadService.payload)
      .then(appealsTrendData => {
        this.appealsLineGraphloading = false;
        if (
          (appealsTrendData['M&R'].length ||
            appealsTrendData['C&S'].length ||
            appealsTrendData['E&I'].length ||
            appealsTrendData['Other'].length) === 0
        ) {
          this.appealsData = null;
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
        }
      })
      .catch(err => {
        this.appealsLineGraphloading = false;
      });
  }

  totalCallsData() {
    this.callsLoading = true;
    this.overviewAdvocateSharedService
      .getTotalCallsShared(this.createPayloadService.payload)
      .then(totalCallsData => {
        if (totalCallsData[0] == null) {
          this.callsLoading = false;
          this.callsData = null;
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
          this.timePeriodCalls =
            this.common.dateFormat(callsLeftData[0].ReportStartDate) +
            ' - ' +
            this.common.dateFormat(callsLeftData[0].ReportEndDate);
          this.callsLoading = false;
        }
      })
      .catch(err => {
        this.callsLoading = false;
      });
  }

  totalCallsTrendLineData() {
    this.callsLineGraphLoading = true;
    this.overviewAdvocateSharedService
      .getTotalCallsTrendLineShared(this.createPayloadService.payload)
      .then(totalCallsTrendData => {
        console.log('totalCallsTrendData', totalCallsTrendData);
        if (totalCallsTrendData == null) {
          this.callsLineGraphLoading = false;
          this.callsData = null;
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
          this.callsLineGraphLoading = false;
          let callsTrendData;
          callsTrendData = totalCallsTrendData;
          this.callsTrendLineGraph = new CallsTrendData(callsTrendData, CallsGeneralData, 'calls-trend-block');
          this.callsData = [];
          for (const key in callsTrendData) {
            if (callsTrendData.hasOwnProperty(key)) {
              this.callsData.push({ key: key, value: this.sumArray(callsTrendData[key]) });
              /* if (
                this.callsData[0].value +
                  this.callsData[1].value +
                  this.callsData[2].value +
                  this.callsData[3].value ===
                0
              ) {
                this.callsLineGraphData = {
                  category: 'large-card',
                  type: 'donut',
                  status: 404,
                  title: this.trendTitleForCalls,
                  MetricID: this.MetricidService.MetricIDs,
                  data: null,
                  timeperiod: null
                };
              }*/
              /*for (let i = 0; i < this.callsData.length; i++) {
              if (this.callsData[i].value === NaN) {
                this.callsData[i].value = 0;
              } else {
               console.log('this.callsData[i].value', this.callsData[0].value);
              }
             }*/
            }
          }
        }
      })
      .catch(err => {
        this.callsLineGraphLoading = false;
      });
  }

  sumArray(arr) {
    let total = 0;
    for (const i in arr) {
      if (arr.hasOwnProperty(i)) {
        /*if (arr[i].value === NaN) {
          arr[i].value = 0;
        }
        console.log('arr[i].value', arr[i].value);*/
        total += arr[i].value;
      }
    }
    return Math.round(total);
  }

  claimsYieldData() {
    this.claimsYieldLoading = true;
    this.downRowMockCards = [{}];
    this.claimsYieldCard = [];
    this.topRowService
      .getClaimsYieldShared(this.createPayloadService.payload)
      .then(claimsYieldData => {
        console.log('claimsYieldData', claimsYieldData);
        this.claimsYieldCard.push(JSON.parse(JSON.stringify(claimsYieldData)));
        this.claimsYieldLoading = false;
      })
      .catch(reason => {
        this.claimsYieldLoading = false;
        console.log('Error Claims Yield Overview page Payment', reason);
      });
  }

  ngDoCheck() {
    this.pagesubTitle = this.session.getHealthCareOrgName() + "'s insights at a glance.";
  }

  ngOnInit() {
    this.pageTitle = 'UHC Insights Provider Performance Dashboard';
    this.pagesubTitle = this.session.getHealthCareOrgName() + "'s insights at a glance.";
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'overviewAdvocatePage' });
    this.checkStorage.emitEvent('overviewAdvocatePage');
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.checkStorage.emitEvent('overviewAdvocatePage');
    this.paymentData();
    this.appealsLeftData();
    this.appealsTrendByMonthData();
    this.claimsYieldData();
    this.totalCallsData();
    this.totalCallsTrendLineData();
    this.paymentsBySubmissionData();
    this.appealsLineGraphloading = true;
    this.callsLineGraphLoading = true;
    this.stackedBarChartLoading = true;
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pagesubTitle = this.session.getHealthCareOrgName() + "'s insights at a glance.";

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
    this.nonPaymentService.sharedTrendByMonth(this.createPayloadService.payload).then(data => {
      const trendData = JSON.parse(JSON.stringify(data));
      if (!trendData || !trendData.data) {
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
        // this.timePeriodLineGraph = trendData.timePeriod;
        this.monthlyLineGraph.chartData = trendData.data;
        this.timePeriodNonPayment = trendData.timePeriod;
        this.trendMonthDisplay = true;
      }
    });

    this.monthlyLineGraph.generalData2 = [];
    this.monthlyLineGraph.chartData2 = [];
  }

  helpIconClick(title) {
    if (title === 'Non-Payment Trend') {
      this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs.ClaimsNonPaymentTrend);
    }
    this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs);
  }

  paymentsBySubmissionData() {
    this.stackedBarChartLoading = false;
    this.pbsLoading = true;
    this.downRowMockCards = [{}];
    this.pbsCard = [];
    this.overviewAdvocateSharedService
      .paymentsBySubmission(this.createPayloadService.payload)
      .then(data => {
        this.pbsCard = JSON.parse(JSON.stringify(data));
        this.pbsLoading = false;
        this.stackedBarChartLoading = true;
      })
      .catch(reason => {
        this.stackedBarChartLoading = false;
        this.pbsLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }
}
