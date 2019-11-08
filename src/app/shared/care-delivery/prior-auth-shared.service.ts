import { Injectable } from '@angular/core';
import { PriorAuthService } from '../../rest/care-delivery/prior-auth.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';

@Injectable({
  providedIn: CareDeliveryPageModule
})
export class PriorAuthSharedService {
  private providerKey: number;
  private priorAuthDataCombined: any;

  constructor(
    private MetricidService: GlossaryMetricidService,
    private priorAuthService: PriorAuthService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}

  getNewPAData(filterParameters) {
    this.providerKey = this.session.providerKeyData();

    // Save Parameters from Filter Session
    const timePeriod = this.common.getTimePeriodFilterValue(filterParameters.timePeriod);
    const TIN = filterParameters.taxId[0];
    const LOB = filterParameters.lineOfBusiness;
    const serviceSetting = filterParameters.serviceSetting;
    const paDecisionType = filterParameters.priorAuthType; // We don't need decision type for now
    const paServiceCategory = this.common.convertServiceCategoryOneWord(
      filterParameters.serviceCategory === '' ? 'All' : filterParameters.serviceCategory
    );

    // Time Range
    let timeRange;
    let timeFilterAdditionalInfo = null;

    if (timePeriod === 'Last 12 Months') {
      timeRange = 'rolling12';
    } else if (timePeriod === 'Last 6 Months') {
      timeRange = 'last6Months';
    } else if (timePeriod === 'Last 3 Months') {
      timeRange = 'last3Months';
    } else if (timePeriod === 'Last 30 Days') {
      timeRange = 'last30Days';
    } else if (timePeriod === 'Year to Date') {
      timeRange = 'startAndEndDates';

      const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date());
      const startDateFinal = yesterday.getFullYear() + '-01-01';

      let endDateString;
      if (yesterday.getDate() < 10) {
        endDateString = '0' + yesterday.getDate();
      } else {
        endDateString = yesterday.getDate();
      }
      const endDateFinal =
        yesterday.getFullYear() +
        '-' +
        this.common.ReturnMonthlyCountString(yesterday.getMonth()) +
        '-' +
        endDateString;

      timeFilterAdditionalInfo = startDateFinal + ', ' + endDateFinal;
    } else {
      // for Calendar Year
      timeRange = 'startAndEndDates';
      timeFilterAdditionalInfo = timePeriod + '-01-01, ' + timePeriod + '-12-31';
    }

    // TIN
    let isAllTinBool;
    let specificTin;

    if (TIN === 'All') {
      isAllTinBool = true;
      specificTin = null;
    } else {
      isAllTinBool = false;
      if (filterParameters.taxId.length === 1) {
        specificTin = parseInt(TIN.replace(/\D/g, ''), 10).toString();
      } else {
        const taxArray = filterParameters.taxId;
        const taxArrayFormatted = [];
        for (let i = 0; i < taxArray.length; i++) {
          taxArrayFormatted.push(parseInt(taxArray[i].replace(/\D/g, ''), 10));
        }
        specificTin = taxArrayFormatted.join(', ');
      }
    }

    // LOB
    let lobString;
    if (LOB === 'All') {
      lobString = 'allLob';
    } else if (LOB === 'CS') {
      lobString = 'cAndSLob';
    } else if (LOB === 'EI') {
      lobString = 'eAndILob';
    } else if (LOB === 'MR') {
      lobString = 'mAndRLob';
    }

    // Service Setting
    let isAllSSFlagBool;
    if (serviceSetting === 'All') {
      isAllSSFlagBool = true;
    } else {
      isAllSSFlagBool = false;
    }

    let isServiceCategory;
    let paServiceCategoryString;
    if (paServiceCategory !== 'All') {
      isServiceCategory = true;
      paServiceCategoryString = paServiceCategory;
    } else {
      isServiceCategory = false;
      paServiceCategoryString = null;
    }

    const requestBody = {
      tin: specificTin,
      lob: lobString,
      allNotApprovedSettings: isAllSSFlagBool,
      decisionType: false,
      decisionValue: null,
      serviceCategory: isServiceCategory,
      serviceCategoryValue: paServiceCategoryString,
      timeFilter: timeRange,
      timeFilterText: timeFilterAdditionalInfo
    };

    const appCardPriorAuthError = [
      {
        category: 'app-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Prior Authorization Requested',
        MetricID: this.MetricidService.MetricIDs.PriorAuthorizationRequested,
        data: null,
        besideData: null,
        timeperiod: null
      },
      {
        category: 'app-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Prior Authorization Approval Rate',
        MetricID: this.MetricidService.MetricIDs.PriorAuthorizationApprovalRate,
        data: null,
        besideData: null,
        timeperiod: null
      }
    ];

    return new Promise(resolve => {
      this.priorAuthService
        .getPriorAuthDataNew([this.providerKey, isAllTinBool], requestBody)
        .subscribe(providerSystems => {
          let PACount = [];
          let PriorAuthBarGraphParameters = [];
          let PANotApprovedReasonBool;
          let PANotApprovedCountChecker;
          if (((providerSystems || {}).PriorAuthorizations || {}).LineOfBusiness) {
            let data;
            // const data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
            if (lobString === 'allLob' && !isServiceCategory) {
              data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
            } else if (lobString !== 'allLob' && !isServiceCategory) {
              if (lobString === 'cAndSLob') {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.CommunityAndState;
              } else if (lobString === 'eAndILob') {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.EmployerAndIndividual;
              } else if (lobString === 'mAndRLob') {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.MedicareAndRetirement;
              }
            } else if (isServiceCategory) {
              if (providerSystems.PriorAuthorizations.LineOfBusiness.hasOwnProperty(paServiceCategoryString)) {
                data = providerSystems.PriorAuthorizations.LineOfBusiness[paServiceCategoryString];
              }
            }

            let PAApprovedCount;
            let PANotApprovedCount;
            let PANotPendingCount;
            let PANotCancelledCount;

            if (isAllSSFlagBool) {
              PAApprovedCount = data.PriorAuthApprovedCount;
              PANotApprovedCount = data.PriorAuthNotApprovedCount;
              PANotPendingCount = data.PriorAuthPendingCount;
              PANotCancelledCount = data.PriorAuthCancelledCount;
            } else {
              if (serviceSetting === 'Inpatient') {
                PAApprovedCount = data.InpatientFacilityApprovedCount;
                PANotApprovedCount = data.InpatientFacilityNotApprovedCount;
                PANotCancelledCount = data.InpatientFacilityCancelledCount;
                PANotPendingCount = data.InpatientFacilityPendingCount;
              } else if (serviceSetting === 'Outpatient') {
                PAApprovedCount = data.OutpatientApprovedCount;
                PANotApprovedCount = data.OutpatientNotApprovedCount;
                PANotCancelledCount = data.OutpatientCancelledCount;
                PANotPendingCount = data.OutpatientPendingCount;
              } else if (serviceSetting === 'Outpatient Facility') {
                PAApprovedCount = data.OutpatientFacilityApprovedCount;
                PANotApprovedCount = data.OutpatientFacilityNotApprovedCount;
                PANotCancelledCount = data.OutpatientFacilityCancelledCount;
                PANotPendingCount = data.OutpatientFacilityPendingCount;
              }
            }

            const PARequestedCount = PAApprovedCount + PANotApprovedCount;
            const PAApprovalRate = PAApprovedCount / PARequestedCount;
            PANotApprovedReasonBool = PAApprovalRate === 1;
            PANotApprovedCountChecker = PAApprovedCount;

            let StandardTATConversion;
            let UrgentTATConversion;
            let TATDayLabel;
            let TATHourLabel;
            if (data.StandartPriorAuthTAT / 86400 < 1) {
              StandardTATConversion = '<1';
              TATDayLabel = StandardTATConversion + ' Day';
            } else {
              StandardTATConversion = (data.StandartPriorAuthTAT / 86400).toFixed(0);
              if (StandardTATConversion === '1') {
                TATDayLabel = StandardTATConversion + ' Day';
              } else {
                TATDayLabel = StandardTATConversion + ' Days';
              }
            }
            if (data.UrgentPriorAuthTAT / 3600 < 1) {
              UrgentTATConversion = '<1';
              TATHourLabel = UrgentTATConversion + ' Hour';
            } else {
              UrgentTATConversion = (data.UrgentPriorAuthTAT / 3600).toFixed(0);
              if (UrgentTATConversion === '1') {
                TATHourLabel = UrgentTATConversion + ' Hour';
              } else {
                TATHourLabel = UrgentTATConversion + ' Hours';
              }
            }
            // Add checker for if PA requested is zero
            const priorAuthorizationCounts = [
              PAApprovedCount,
              PANotApprovedCount,
              PANotPendingCount,
              PANotCancelledCount
            ];
            const priorAuthorizationLabels = ['Approved', 'Not Approved', 'Pending', 'Canceled'];
            if (PARequestedCount === 0) {
              if (PANotPendingCount + PANotCancelledCount > 0) {
                PACount = [
                  {
                    category: 'app-card',
                    type: 'donutWithLabel',
                    title: 'Prior Authorization Requested',
                    MetricID: this.MetricidService.MetricIDs.PriorAuthorizationRequested,
                    data: {
                      graphValues: priorAuthorizationCounts,
                      centerNumber: this.common.nFormatter(PARequestedCount),
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                      gdata: ['card-inner', 'PARequested'],
                      hover: true
                    },
                    besideData: {
                      labels: this.common.sideLabelWords(priorAuthorizationCounts, priorAuthorizationLabels),
                      color: this.common.sideLabelColor(priorAuthorizationCounts)
                    },
                    timeperiod: timePeriod
                  }
                ];
              } else {
                PACount = appCardPriorAuthError;
              }
            } else {
              PACount = [
                {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Prior Authorization Requested',
                  MetricID: this.MetricidService.MetricIDs.PriorAuthorizationRequested,
                  data: {
                    graphValues: priorAuthorizationCounts,
                    centerNumber: this.common.nFormatter(PARequestedCount),
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                    labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                    gdata: ['card-inner', 'PARequested'],
                    hover: true
                  },
                  besideData: {
                    labels: this.common.sideLabelWords(priorAuthorizationCounts, priorAuthorizationLabels),
                    color: this.common.sideLabelColor(priorAuthorizationCounts)
                  },
                  timeperiod: timePeriod
                },
                {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Prior Authorization Approval Rate',
                  MetricID: this.MetricidService.MetricIDs.PriorAuthorizationApprovalRate,
                  data: {
                    graphValues: [PAApprovalRate, 1 - PAApprovalRate],
                    centerNumber: (PAApprovalRate * 100).toFixed(0) + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'PAApprovalRate']
                  },
                  besideData: {
                    verticalData: [
                      { title: 'Average Turnaround Time' },
                      { values: TATDayLabel, labels: 'Standard' },
                      { values: TATHourLabel, labels: 'Urgent' }
                    ]
                  },
                  timeperiod: timePeriod
                }
              ];
            }
          } else {
            PACount = appCardPriorAuthError;
          }

          let PriorAuthNotApprovedReasons = [];

          let lobStringFormatted;
          if (LOB === 'All') {
            lobStringFormatted = 'All';
          } else if (LOB === 'Community & State') {
            lobStringFormatted = 'Cs';
          } else if (LOB === 'Employer & Individual') {
            lobStringFormatted = 'Ei';
          } else if (LOB === 'Medicare & Retirement') {
            lobStringFormatted = 'Mr';
          }

          if (
            providerSystems[lobStringFormatted] !== null &&
            providerSystems.hasOwnProperty(lobStringFormatted) &&
            providerSystems[lobStringFormatted].hasOwnProperty('NotApproved')
          ) {
            if (
              isAllSSFlagBool &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('AllNotApprovedSettings')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.AllNotApprovedSettings;
            } else if (
              serviceSetting === 'Inpatient' &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('InPatient')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.InPatient;
            } else if (
              serviceSetting === 'Outpatient' &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('OutPatient')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.OutPatient;
            } else if (
              serviceSetting === 'Outpatient Facility' &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('OutPatientFacility')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.OutPatientFacility;
            }
          }

          // if (!isServiceCategory) {
          if (PriorAuthNotApprovedReasons.length > 0 && !isServiceCategory) {
            PriorAuthNotApprovedReasons.sort(function(a, b) {
              return b.Count - a.Count;
            });

            const barScaleMax = PriorAuthNotApprovedReasons[0].Count;
            for (let i = 0; i < PriorAuthNotApprovedReasons.length; i++) {
              PriorAuthBarGraphParameters.push({
                type: 'singleBarChart',
                title: 'Top Reasons for Prior Authorizations Not Approved',
                MetricID: this.MetricidService.MetricIDs.TopReasonsforPriorAuthorizationsNotApproved,
                data: {
                  barHeight: 48,
                  barData: PriorAuthNotApprovedReasons[i].Count,
                  barSummation: barScaleMax,
                  barText: PriorAuthNotApprovedReasons[i].Reason,
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'reasonBar' + i]
                },
                timeperiod: timePeriod
              });
            }
          } else if (isServiceCategory || PANotApprovedReasonBool || !PANotApprovedCountChecker) {
            // Hide reasons for service category
            // Also hide reasons if its a 100 percent approval rate
            // And hide if not approved count is zero
            PriorAuthBarGraphParameters = [
              {
                data: null
              }
            ];
          } else {
            PriorAuthBarGraphParameters = [
              {
                category: 'large-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Top Reasons for Prior Authorizations Not Approved',
                MetricID: this.MetricidService.MetricIDs.TopReasonsforPriorAuthorizationsNotApproved,
                data: null,
                besideData: null,
                timeperiod: null
              }
            ];
          }

          const PAData = [PACount, PriorAuthBarGraphParameters];
          resolve(PAData);
        });
    });
  }

  getPriorAuthDataCombined(filterParameters) {
    return new Promise(resolve => {
      this.getNewPAData(filterParameters)
        .then(data => {
          this.priorAuthDataCombined = data;
          const emptyPATrends = [
            {
              data: '',
              sign: ''
            },
            {
              data: '',
              sign: ''
            }
          ];
          return emptyPATrends;
        })
        .then(data => {
          if (this.priorAuthDataCombined[0].length > 0 && this.priorAuthDataCombined[0][0].data !== null) {
            // this.priorAuthDataCombined[0][1].data['sdata'] = data[1];
          }
          resolve(this.priorAuthDataCombined);
        })
        .catch(reason => {
          // this.priorAuthDataCombined[0][1].data['sdata'] = null;
          resolve(this.priorAuthDataCombined);
          console.log('Prior Auth Service Error ', reason);
        });
    });
  }
}
