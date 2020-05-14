import { Component, OnInit, DoCheck } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from '../../../shared/session.service';
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
import { ICallsResponse } from 'src/app/modals/i-calls';

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
  timePeriodAppeals: string;
  lob: string;
  trendTitle = 'Claims Non-Payment Trend';
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
  trendTitleForClaims = 'Claims Appeals Processed';
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
  errorAppealsData: any;
  callsLineGraphLoading: boolean;
  trendTitleForCalls = 'Calls by Call Type';
  totalCalls: any;
  callsLoading: boolean;
  callsLineGraphData: any;
  callsData: any;
  claimsYieldLoading: boolean;
  downRowMockCards: any;
  yieldRowMockCards: any;
  claimsYieldCard: Array<Object>;
  pbsLoading: boolean;
  pbsCard: any;
  paperClaims: any;
  electronicClaims: any;
  stackedBarChartData: any = {
    chartId: '',
    chartData: ''
  };
  nonpaymentLoading: any;

  constructor(
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
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
    // const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
      this.createPayloadService.resetTinNumber('overviewAdvocatePage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
    });
    this.iconRegistry.addSvgIcon(
      'filter',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'warning-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/warning-icon.svg')
    );
    this.iconRegistry.addSvgIcon(
      'metric-development',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-insert_chart-24px.svg')
    );
    /* this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    }); */
  }

  paymentData() {
    this.paymentLoading = true;
    this.topRowMockCards = [{}, {}, {}];
    this.topRowService
      .getPaymentShared(this.createPayloadService.payload)
      .then((paymentData: any) => {
        this.paymentCards = paymentData;
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

    this.overviewAdvocateSharedService
      .getAppealsLeftShared(this.createPayloadService.payload)
      .then(appealsLeftData => {
        if (
          appealsLeftData &&
          appealsLeftData['Data'][0] &&
          appealsLeftData['Data'][0][0] !== null &&
          appealsLeftData['Data'][0][0].LineOfBusiness &&
          appealsLeftData['Data'][0][0].LineOfBusiness != null
        ) {
          // const AppealsLeftData: any;
          const AppealsLeftData = appealsLeftData['Data'][0];
          this.totalAppeals = this.common.nFormatter(
            AppealsLeftData[0].LineOfBusiness.ALL.AdminAppeals + AppealsLeftData[0].LineOfBusiness.ALL.ClinicalAppeals
          );
          this.timePeriodAppeals =
            this.common.dateFormat(AppealsLeftData[0].StartDate) +
            '&ndash;' +
            this.common.dateFormat(AppealsLeftData[0].EndDate);
          this.appealsloading = false;
        } else {
          this.appealsloading = false;
          this.totalAppeals = null;
          this.errorAppealsData = {
            category: 'large-card',
            type: 'donut',
            status: 404,
            title: 'Claims Appeals Processed',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmittedTrend,
            data: null,
            timeperiod: null
          };
        }
      })
      .catch(() => {
        this.appealsloading = false;
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
      .catch(() => {
        this.appealsLineGraphloading = false;
      });
  }

  totalCallsData() {
    this.callsLoading = true;
    this.overviewAdvocateSharedService
      .getTotalCallsShared(this.createPayloadService.payload)
      .then((response: ICallsResponse) => {
        const totalCallsData = response.Data;

        if (totalCallsData == null) {
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
          this.totalCalls = this.common.nondecimalFormatter(callsLeftData.CallVolByQuesType.Total);
          this.timePeriodCalls =
            this.common.dateFormat(callsLeftData.ReportStartDate) +
            '&ndash;' +
            this.common.dateFormat(callsLeftData.ReportEndDate);
          this.callsLoading = false;
        }
      })
      .catch(() => {
        this.callsLoading = false;
      });
  }

  totalCallsTrendLineData() {
    // this.callsLineGraphLoading = true;
    this.overviewAdvocateSharedService
      .getTotalCallsTrendLineShared(this.createPayloadService.payload)
      .then(totalCallsTrendData => {
        if (
          totalCallsTrendData == null ||
          (totalCallsTrendData['B&E'].length === 0 &&
            totalCallsTrendData['P&A'].length === 0 &&
            totalCallsTrendData['CLAIMS'].length === 0 &&
            totalCallsTrendData['Other'].length === 0)
        ) {
          // this.callsLineGraphLoading = false;
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
          // this.callsLineGraphLoading = false;
          // let callsTrendData;
          const callsTrendData = { ...totalCallsTrendData };
          this.callsTrendLineGraph = new CallsTrendData(callsTrendData, CallsGeneralData, 'calls-trend-block');
          this.callsData = [];
          for (const key in totalCallsTrendData) {
            if (totalCallsTrendData.hasOwnProperty(key)) {
              this.callsData.push({ key: key, value: this.sumArray(totalCallsTrendData[key]) });
              /* if (
                this.callsData[0].length +
                  this.callsData[1].length +
                  this.callsData[2].length +
                  this.callsData[3].length ===
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
                this.callsData = null;
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
      .catch(() => {
        //   this.callsLineGraphLoading = false;
      });
  }

  sumArray(arr) {
    let total = 0;
    for (const i in arr) {
      if (arr.hasOwnProperty(i)) {
        if (arr[i].value === undefined) {
          arr[i].value = 0;
        }
        total += arr[i].value;
      }
    }
    return Math.round(total);
  }

  claimsYieldData() {
    this.claimsYieldLoading = true;
    this.yieldRowMockCards = [{}];
    this.claimsYieldCard = [];
    this.topRowService
      .getClaimsYieldShared(this.createPayloadService.payload)
      .then(claimsYieldData => {
        this.claimsYieldCard.push(claimsYieldData);
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
    // this.appealsTrendByMonthData();
    this.claimsYieldData();
    this.totalCallsData();
    this.totalCallsTrendLineData();
    this.paymentsBySubmissionData();
    this.appealsLineGraphloading = true;
    this.callsLineGraphLoading = true;
    // this.stackedBarChartLoading = true;
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pagesubTitle = this.session.getHealthCareOrgName() + "'s insights at a glance.";

    this.monthlyLineGraph.chartId = 'non-payment-trend-block';
    this.monthlyLineGraph.titleData = [{}];
    this.monthlyLineGraph.generalData = [
      {
        width: 946,
        backgroundColor: 'null',
        barGraphNumberSize: 18,
        barColor: '#196ECF',
        parentDiv: 'non-payment-trend-block',
        tooltipBoolean: true,
        hideYAxis: false,
        yAxisUnits: '$',
        height: 298
      }
    ];

    this.monthlyLineGraph.chartData = [];
    this.trendMonthDisplay = false;
    this.nonpaymentLoading = true;
    // This is for line graph
    this.nonPaymentService.sharedTrendByMonth(this.createPayloadService.payload).then((data: any) => {
      const trendData = data;
      this.nonpaymentLoading = false;
      if (!trendData || !trendData.data) {
        this.trendMonthDisplay = false;
        this.nonpaymentLoading = false;
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
        this.nonpaymentLoading = false;
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
    this.pbsLoading = true;
    this.downRowMockCards = [{}];
    this.pbsCard = [];
    this.overviewAdvocateSharedService
      .paymentsBySubmission(this.createPayloadService.payload)
      .then(data => {
        this.pbsCard = data;
        this.pbsLoading = false;
      })
      .catch(reason => {
        this.pbsLoading = false;
        console.log('Error Payment Submission Advocate Overview page Payment', reason);
      });
  }
}
