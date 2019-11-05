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
    private filtermatch: CommonUtilsService,
    private topRowService: TopRowAdvOverviewSharedService,
    private nonPaymentService: NonPaymentSharedService,
    public MetricidService: GlossaryMetricidService,
    public overviewAdvocateSharedService: OverviewAdvocateSharedService,
    private glossaryExpandService: GlossaryExpandService
  ) {
    this.pageTitle = 'Welcome, ' + this.userName;
    this.pagesubTitle = 'Your Insights at a glance.';

    const filData = this.session.getFilChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  paymentData() {
    this.paymentLoading = true;
    this.topRowMockCards = [{}, {}, {}];

    this.topRowService
      .getPaymentShared()
      .then(paymentData => {
        this.paymentCards = JSON.parse(JSON.stringify(paymentData));
        this.paymentLoading = false;
      })
      .catch(reason => {
        this.paymentLoading = false;
        console.log('Adovate Overview page Payment', reason);
      });
  }

  appealsLeftData() {
    this.appealsloading = true;
    this.appealsmockCards = [{}, {}, {}, {}];

    this.overviewAdvocateSharedService.getAppealsLeftShared().then(appealsLeftData => {
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
    this.overviewAdvocateSharedService.getAppealsTrendByMonthShared().then(appealsTrendData => {
      this.appealsLineGraphloading = false;

      console.log(
        appealsTrendData['M&R'].length ||
          appealsTrendData['C&S'].length ||
          appealsTrendData['E&I'].length ||
          appealsTrendData['Other'].length
      );

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
      }
    });
  }

  totalCallsData() {
    this.callsLoading = true;
    this.overviewAdvocateSharedService.getTotalCallsShared().then(totalCallsData => {
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
        this.totalCalls = this.filtermatch.nondecimalFormatter(callsLeftData[0].CallVolByQuesType.Total);
        this.callsLoading = false;
      }
    });
  }

  ngOnInit() {
    this.checkStorage.emitEvent('overviewPage');
    this.paymentData();
    this.appealsLeftData();
    this.appealsTrendByMonthData();
    this.totalCallsData();
    this.appealsLineGraphloading = true;
    // this.callsLineGraphLoading = true;
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Welcome, ' + this.userName;

    this.timePeriod = this.session.filterObjValue.timeFrame;
    console.log(this.session.filterObjValue.lob);
    if (this.session.filterObjValue.lob !== 'All') {
      this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    } else {
      this.lob = '';
    }
    console.log(this.lob);
    if (this.session.filterObjValue.tax.length > 0 && this.session.filterObjValue.tax[0] !== 'All') {
      this.taxID = this.session.filterObjValue.tax;
      if (this.taxID.length > 3) {
        this.taxID = [this.taxID.length + ' Selected'];
      }
    } else {
      this.taxID = ['All'];
    }
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
  }

  helpIconClick(title) {
    if (title === 'Non-Payment Trend') {
      this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs.ClaimsNonPaymentTrend);
    }
    this.glossaryExpandService.setMessage(title, this.MetricidService.MetricIDs);
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
