import { Injectable } from '@angular/core';
import { PriorAuthService } from '../../rest/care-delivery/prior-auth.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
@Injectable({
  providedIn: 'root'
})
export class PriorAuthSharedService {
  private providerKey: number;
  private priorAuthDataCombined: any;

  constructor(
    private MetricidService: GlossaryMetricidService,
    private priorAuthService: PriorAuthService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}

  getNewPAData(filterParameters) {
    this.providerKey = this.session.providerKeyData();

    // Save Parameters from Filter Session
    const timePeriod = this.common.getTimePeriodFilterValue(filterParameters.timePeriod);
    const TIN = filterParameters.taxId[0];
    const LOB = filterParameters.lineOfBusiness;
    const serviceSetting = filterParameters.serviceSetting === '' ? 'All' : filterParameters.serviceSetting;
    const paDecisionType = filterParameters.priorAuthType; // We don't need decision type for now
    const paServiceCategory = filterParameters.serviceCategory === '' ? 'All' : filterParameters.serviceCategory;

    // const paServiceCategory =  filterParameters.serviceCategory;

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
    let serviceSettingString;
    if (serviceSetting !== 'All') {
      isAllSSFlagBool = false;
      serviceSettingString = serviceSetting;
    } else {
      isAllSSFlagBool = true;
      serviceSettingString = null;
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

    // // Service Setting
    // let isAllSSFlagBool;
    // if (serviceSetting === 'All') {
    //   isAllSSFlagBool = true;
    // } else {
    //   isAllSSFlagBool = false;
    // }

    if (serviceSetting === 'All') {
      serviceSettingString = null;
    } else if (serviceSetting === 'Inpatient') {
      serviceSettingString = 'Inpatient';
    } else if (serviceSetting === 'Outpatient') {
      serviceSettingString = 'Outpatient';
    } else if (serviceSetting === 'Outpatient Facility') {
      serviceSettingString = 'Outpatient Facility';
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
      timeFilterText: timeFilterAdditionalInfo,
      serviceSetting: serviceSettingString
    };

    const appCardPriorAuthError = [
      {
        category: 'app-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Prior Authorization Requested',
        MetricID: this.MetricidService.MetricIDs.PriorAuthorizationRequested,
        toggle: this.toggle.setToggles('Prior Authorization Requested', 'Prior Authorizations', 'Care Delivery', false),
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
        toggle: this.toggle.setToggles(
          'Prior Authorization Approval Rate',
          'Prior Authorizations',
          'Care Delivery',
          false
        ),
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
            let PAApprovedCount;
            let PANotApprovedCount;
            let PANotPendingCount;
            let PANotCancelledCount;

            // LOB all

            if (isAllSSFlagBool) {
              if (lobString === 'allLob') {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
              } else {
                if (lobString !== 'allLob') {
                  if (lobString === 'cAndSLob') {
                    data = providerSystems.PriorAuthorizations.LineOfBusiness.CommunityAndState;
                  } else if (lobString === 'eAndILob') {
                    data = providerSystems.PriorAuthorizations.LineOfBusiness.EmployerAndIndividual;
                  } else if (lobString === 'mAndRLob') {
                    data = providerSystems.PriorAuthorizations.LineOfBusiness.MedicareAndRetirement;
                  }
                } else if (isServiceCategory && lobString === 'allLob') {
                  if (providerSystems.PriorAuthorizations.hasOwnProperty('ServiceCategory')) {
                    data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
                  }
                }
              }
            }
            // service setting default
            if (
              serviceSetting === 'Inpatient' ||
              serviceSetting === 'Outpatient' ||
              serviceSetting === 'Outpatient Facility'
            ) {
              data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
            }
            // LOB with Service Setting
            if (lobString !== 'allLob') {
              if (
                lobString === 'cAndSLob' &&
                (serviceSetting === 'Inpatient' ||
                  serviceSetting === 'Outpatient' ||
                  serviceSetting === 'Outpatient Facility')
              ) {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.CommunityAndState;
              } else if (
                lobString === 'eAndILob' &&
                (serviceSetting === 'Inpatient' ||
                  serviceSetting === 'Outpatient' ||
                  serviceSetting === 'Outpatient Facility')
              ) {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.EmployerAndIndividual;
              } else if (
                lobString === 'mAndRLob' &&
                (serviceSetting === 'Inpatient' ||
                  serviceSetting === 'Outpatient' ||
                  serviceSetting === 'Outpatient Facility')
              ) {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.MedicareAndRetirement;
              }
            }

            PAApprovedCount = data.PriorAuthApprovedCount;
            PANotApprovedCount = data.PriorAuthNotApprovedCount;
            PANotPendingCount = data.PriorAuthPendingCount;
            PANotCancelledCount = data.PriorAuthCancelledCount;

            const PARequestedCount = PAApprovedCount + PANotApprovedCount;
            const PAApprovalRate = PAApprovedCount / PARequestedCount;
            PANotApprovedReasonBool = PAApprovalRate === 1;
            PANotApprovedCountChecker = PAApprovedCount;

            let StandardTATConversion;
            let UrgentTATConversion;
            let TATDayLabel;
            let TATHourLabel;
            if (data.AvgTatStandard_hours / 24 < 1) {
              StandardTATConversion = '<1';
              TATDayLabel = StandardTATConversion + ' Day';
            } else {
              StandardTATConversion = (data.AvgTatStandard_hours / 24).toFixed(0);
              if (StandardTATConversion === '1') {
                TATDayLabel = StandardTATConversion + ' Day';
              } else {
                TATDayLabel = StandardTATConversion + ' Days';
              }
            }
            if (data.AvgTatUrgent_hours < 1) {
              UrgentTATConversion = '<1';
              TATHourLabel = UrgentTATConversion + ' Hour';
            } else {
              UrgentTATConversion = data.AvgTatUrgent_hours.toFixed(0);
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
                    toggle: this.toggle.setToggles(
                      'Prior Authorization Requested',
                      'Prior Authorizations',
                      'Care Delivery',
                      false
                    ),
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
                    timeperiod:
                      this.common.dateFormat(providerSystems.StartDate) +
                      '&ndash;' +
                      this.common.dateFormat(providerSystems.EndDate)
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
                  toggle: this.toggle.setToggles(
                    'Prior Authorization Requested',
                    'Prior Authorizations',
                    'Care Delivery',
                    false
                  ),
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
                    color: this.common.sideLabelColor(priorAuthorizationCounts),
                    value: this.common.sideLabelValues(priorAuthorizationCounts)
                  },
                  timeperiod:
                    this.common.dateFormat(providerSystems.StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(providerSystems.EndDate)
                },
                {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Prior Authorization Approval Rate',
                  MetricID: this.MetricidService.MetricIDs.PriorAuthorizationApprovalRate,
                  toggle: this.toggle.setToggles(
                    'Prior Authorization Approval Rate',
                    'Prior Authorizations',
                    'Care Delivery',
                    false
                  ),
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
                  timeperiod:
                    this.common.dateFormat(providerSystems.StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(providerSystems.EndDate)
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
          } else if (LOB === 'CS') {
            lobStringFormatted = 'Cs';
          } else if (LOB === 'EI') {
            lobStringFormatted = 'Ei';
          } else if (LOB === 'MR') {
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
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('Inpatient')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.Inpatient;
            } else if (
              serviceSetting === 'Outpatient' &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('Outpatient')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.Outpatient;
            } else if (
              serviceSetting === 'Outpatient Facility' &&
              providerSystems[lobStringFormatted].NotApproved.hasOwnProperty('OutpatientFacility')
            ) {
              PriorAuthNotApprovedReasons = providerSystems[lobStringFormatted].NotApproved.OutpatientFacility;
            }
          }

          // if (!isServiceCategory) {
          if (PriorAuthNotApprovedReasons.length > 0) {
            PriorAuthNotApprovedReasons.sort(function(a, b) {
              return b.Count - a.Count;
            });

            const barScaleMax = PriorAuthNotApprovedReasons[0].Count;
            for (let i = 0; i < PriorAuthNotApprovedReasons.length; i++) {
              PriorAuthBarGraphParameters.push({
                type: 'singleBarChart',
                title: 'Top Reasons for Prior Authorizations Not Approved',
                MetricID: this.MetricidService.MetricIDs.TopReasonsforPriorAuthorizationsNotApproved,
                toggle: this.toggle.setToggles(
                  'Top Reasons for Prior Authorizations Not Approved',
                  'Prior Authorizations',
                  'Care Delivery',
                  false
                ),
                data: {
                  barHeight: 48,
                  barData: PriorAuthNotApprovedReasons[i].Count,
                  barSummation: barScaleMax,
                  barText: PriorAuthNotApprovedReasons[i].Reason,
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'reasonBar' + i]
                },
                timeperiod:
                  this.common.dateFormat(providerSystems.StartDate) +
                  '&ndash;' +
                  this.common.dateFormat(providerSystems.EndDate)
              });
            }
          } else if (PANotApprovedReasonBool || !PANotApprovedCountChecker) {
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
                toggle: this.toggle.setToggles(
                  'Top Reasons for Prior Authorizations Not Approved',
                  'Prior Authorizations',
                  'Care Delivery',
                  false
                ),
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
            this.priorAuthDataCombined[0][1].data['sdata'] = data[1];
          }
          resolve(this.priorAuthDataCombined);
        })
        .catch(reason => {
          this.priorAuthDataCombined[0][1].data['sdata'] = null;
          resolve(this.priorAuthDataCombined);
          console.log('Prior Auth Service Error ', reason);
        });
    });
  }
}
