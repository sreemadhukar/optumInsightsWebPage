import { Injectable } from '@angular/core';
import { PriorAuthService } from '../../rest/prior-auth/prior-auth.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class PriorAuthSharedService {
  private priorAuthData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;

  constructor(
    private priorAuthService: PriorAuthService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}

  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  public generateMonth(a) {
    if (a === 0) {
      return 'January';
    } else if (a === 1) {
      return 'February';
    } else if (a === 2) {
      return 'March';
    } else if (a === 3) {
      return 'April';
    } else if (a === 4) {
      return 'May';
    } else if (a === 5) {
      return 'June';
    } else if (a === 6) {
      return 'July';
    } else if (a === 7) {
      return 'August';
    } else if (a === 8) {
      return 'September';
    } else if (a === 9) {
      return 'October';
    } else if (a === 10) {
      return 'November';
    } else if (a === 11) {
      return 'December';
    } else {
      return null;
    }
  }

  public ReturnMonthlyCountString(a) {
    if (a === 0) {
      return '01';
    } else if (a === 1) {
      return '02';
    } else if (a === 2) {
      return '03';
    } else if (a === 3) {
      return '04';
    } else if (a === 4) {
      return '05';
    } else if (a === 5) {
      return '06';
    } else if (a === 6) {
      return '07';
    } else if (a === 7) {
      return '08';
    } else if (a === 8) {
      return '09';
    } else if (a === 9) {
      return '10';
    } else if (a === 10) {
      return '11';
    } else if (a === 11) {
      return '12';
    }
  }

  public getPCORData() {
    this.providerKey = this.session.providerKeyData();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const parametersExecutive = [this.providerKey, true];

      this.priorAuthService.getPriorAuthData(...parametersExecutive).subscribe(
        data => {
          const PCORData = data.PatientCareOpportunity;
          let PCORChecker;
          if (PCORData === null) {
            PCORChecker = false;
          } else {
            PCORChecker = true;
          }
          resolve(PCORChecker);
        },
        err => {
          console.log('PCOR Error', err);
        }
      );
    });
  }

  public getPriorAuthData() {
    this.providerKey = this.session.providerKeyData();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];
      const timeRange = 'rolling12';
      const isAllTin = true;
      const isAlllob = true;
      const isAllSS = true;

      this.priorAuthService.getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters).subscribe(
        providerSystems => {
          let PACount = [];
          let PriorAuthBarGraphParamaters = [];
          if (
            providerSystems.PriorAuthorizations !== null &&
            providerSystems.hasOwnProperty('PriorAuthorizations') &&
            providerSystems.PriorAuthorizations.hasOwnProperty('LineOfBusiness') &&
            providerSystems.PriorAuthorizations.LineOfBusiness.hasOwnProperty('All') &&
            providerSystems.PriorAuthorizations.LineOfBusiness.All.hasOwnProperty('PriorAuthApprovedCount')
          ) {
            const data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
            const PAApprovedCount = data.PriorAuthApprovedCount;
            const PANotApprovedCount = data.PriorAuthNotApprovedCount;
            const PANotPendingCount = data.PriorAuthPendingCount;
            const PANotCancelledCount = data.PriorAuthCancelledCount;
            const PARequestedCount = PAApprovedCount + PANotApprovedCount;
            const PAApprovalRate = PAApprovedCount / PARequestedCount;
            let StandardTATConversion;
            let UrgentTATConversion;
            if (data.StandartPriorAuthTAT / 86400 < 1) {
              StandardTATConversion = '<1';
            } else {
              StandardTATConversion = (data.StandartPriorAuthTAT / 86400).toFixed(0);
            }
            if (data.UrgentPriorAuthTAT / 3600 < 1) {
              UrgentTATConversion = '<1';
            } else {
              UrgentTATConversion = (data.UrgentPriorAuthTAT / 3600).toFixed(0);
            }

            PACount = [
              {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Prior Authorization Requested',
                data: {
                  graphValues: [PAApprovedCount, PANotApprovedCount, PANotPendingCount, PANotCancelledCount],
                  centerNumber: this.nFormatter(PARequestedCount, 1),
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                  gdata: ['card-inner', 'PARequested'],
                  hover: true
                },
                besideData: {
                  labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: 'Last 6 Months'
              },
              {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Prior Authorization Approval Rate',
                data: {
                  graphValues: [PAApprovalRate, 1 - PAApprovalRate],
                  centerNumber: (PAApprovalRate * 100).toFixed(0) + '%',
                  color: ['#3381FF', '#E0E0E0'],
                  gdata: ['card-inner', 'PAApprovalRate']
                },
                besideData: {
                  verticalData: [
                    { title: 'Average Turnaround Time' },
                    { values: StandardTATConversion + ' Days', labels: 'Standard' },
                    { values: UrgentTATConversion + ' Hours', labels: 'Urgent' }
                  ]
                },

                timeperiod: 'Last 6 Months'
              }
            ];
          } else {
            PACount = [];
          }

          // if (providerSystems.All.NotApproved.AllNotApprovedSettings !== null) {
          if (
            providerSystems.All !== null &&
            providerSystems.hasOwnProperty('All') &&
            providerSystems.All.hasOwnProperty('NotApproved') &&
            providerSystems.All.NotApproved.hasOwnProperty('AllNotApprovedSettings')
          ) {
            const PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.AllNotApprovedSettings;
            PriorAuthNotApprovedReasons.sort(function(a, b) {
              return b.Count - a.Count;
            });

            const barScaleMax = PriorAuthNotApprovedReasons[0].Count;
            for (let i = 0; i < PriorAuthNotApprovedReasons.length; i++) {
              PriorAuthBarGraphParamaters.push({
                type: 'singleBarChart',
                title: 'Top Reasons for Prior Authorizations Not Approved',
                data: {
                  barHeight: 40,
                  barData: PriorAuthNotApprovedReasons[i].Count,
                  barSummation: barScaleMax,
                  barText: PriorAuthNotApprovedReasons[i].Reason,
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'reasonBar' + i]
                },
                timeperiod: 'Last 6 Months'
              });
            }
          } else {
            PriorAuthBarGraphParamaters = [];
          }
          const PAData = [PACount, PriorAuthBarGraphParamaters];
          resolve(PAData);
        },
        err => {
          console.log('Prior Auth Error', err);
        }
      );
    });
  }

  getPCORMandRData() {
    this.providerKey = this.session.providerKeyData();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const parametersExecutive = [this.providerKey, true];

      this.priorAuthService.getPriorAuthData(...parametersExecutive).subscribe(
        data => {
          const PCORData = data.PatientCareOpportunity;
          // Reporting Date will be used for all three cards
          const PCORMRdate = PCORData.ReportingPeriod;
          const PCORMRmonth = this.generateMonth(parseInt(PCORMRdate.substr(0, 2)) - 1);
          const PCORMRday = parseInt(PCORMRdate.substr(3, 2));
          const PCORMRyear = PCORMRdate.substr(6, 4);
          const PCORRMReportingDate = PCORMRmonth + ' ' + PCORMRday + ', ' + PCORMRyear;

          const PCORMandRData = PCORData.LineOfBusiness.MedicareAndRetirement;

          const totalAllCompletionRate = PCORMandRData.TotalACVs / PCORMandRData.TotalPatientCount;
          const totalDiabeticCompletionRate = PCORMandRData.TotalDiabeticACVs / PCORMandRData.TotalDiabeticPatients;

          const MandRAvgStarRatingCard = [
            {
              category: 'app-card',
              type: 'star',
              title: 'Medicare & Retirement Average Star Rating',
              data: {
                graphValues: [PCORMandRData.AverageStarRating],
                centerNumber: PCORMandRData.AverageStarRating,
                color: ['#00A8F7', '#D7DCE1', '#FFFFFF'],
                gdata: ['card-inner', 'pcorCardD3Star']
              },
              sdata: null,
              timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
            }
          ];
          const MandRACVCard = [
            {
              category: 'app-card',
              type: 'donutWithLabelandTab',
              title: 'Medicare & Retirement Annual Care Visits Completion Rate',
              data: {
                All: {
                  graphValues: [totalAllCompletionRate, 1 - totalAllCompletionRate],
                  centerNumber: (totalAllCompletionRate * 100).toFixed(0) + '%',
                  color: ['#3381FF', '#E0E0E0'],
                  gdata: ['card-inner', 'PCORACVAll']
                },
                Diabetic: {
                  graphValues: [totalDiabeticCompletionRate, 1 - totalDiabeticCompletionRate],
                  centerNumber: (totalDiabeticCompletionRate * 100).toFixed(0) + '%',
                  color: ['#3381FF', '#E0E0E0'],
                  gdata: ['card-inner', 'PCORACVDiabetic']
                }
              },
              sdata: {
                sign: null,
                data: null
              },
              besideData: {
                All: {
                  verticalData: [
                    { title: '' },
                    {
                      values: PCORMandRData.TotalPatientCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      labels: 'Total Patients'
                    },
                    {
                      values: PCORMandRData.TotalACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      labels: 'Completed'
                    }
                  ]
                },
                Diabetic: {
                  verticalData: [
                    { title: '' },
                    {
                      values: PCORMandRData.TotalDiabeticPatients.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      labels: 'Total Patients'
                    },
                    {
                      values: PCORMandRData.TotalDiabeticACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                      labels: 'Completed'
                    }
                  ]
                }
              },
              timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
            }
          ];

          const PCORRatings = [
            PCORMandRData['5StarMeasureCount'],
            PCORMandRData['4StarMeasureCount'],
            PCORMandRData['3StarMeasureCount'],
            PCORMandRData['2StarMeasureCount'],
            PCORMandRData['1StarMeasureCount']
          ];

          const barScaleMax = Math.max(...PCORRatings);

          const MandRStarRatingCard = [];

          for (let i = 0; i < PCORRatings.length; i++) {
            MandRStarRatingCard.push({
              type: 'singleBarChart',
              title: 'Quality Star Ratings',
              data: {
                barHeight: 48,
                barData: PCORRatings[i],
                barSummation: barScaleMax,
                barText: PCORRatings[i],
                color: [{ color1: '#3381FF' }],
                gdata: ['card-inner-large', 'PCORreasonBar' + i],
                starObject: true,
                starCount: 5 - i
              },
              timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
            });
          }

          const PCORCards = [MandRAvgStarRatingCard, MandRACVCard, MandRStarRatingCard];

          resolve(PCORCards);
        },
        err => {
          console.log('PCOR Error', err);
        }
      );
    });
  }

  getPriorAuthDataFiltered(filterParamteres) {
    this.providerKey = this.session.providerKeyData();

    const timePeriod = filterParamteres.timeFrame;
    const TIN = filterParamteres.tax[0];
    const LOB = filterParamteres.lob;
    const serviceSetting = filterParamteres.serviceSetting;
    // console.log(filterParamteres);

    // Default parameters
    let timeRange = 'rolling12';
    let timeRangeAPIParameter;
    let timeRangeAdditionalData;
    let isAllTinBool = true;
    let specificTin = '';
    let tinNumberFormatted;
    let isAllLobBool = true;
    let iscAndSLobBool = false;
    let iseAndILobBool = false;
    let ismAndRLobBool = false;
    let isAllSSFlagBool = true; // Only if we need all reasons; most commands will already give all 3 so just have to filter

    // configurations for time period
    if (timePeriod === 'Last 12 Months') {
      timeRange = 'rolling12';
    } else if (timePeriod === 'Last 6 Months') {
      timeRange = 'last6Months';
    } else if (timePeriod === 'Year to Date') {
      timeRange = 'customDateRange';
      const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date());
      timeRangeAPIParameter = yesterday.getFullYear() + '-01-01';
      let endDateString;
      if (yesterday.getDate() < 10) {
        endDateString = '0' + yesterday.getDate();
      } else {
        endDateString = yesterday.getDate();
      }
      timeRangeAdditionalData =
        yesterday.getFullYear() + '-' + this.ReturnMonthlyCountString(yesterday.getMonth()) + '-' + endDateString;
    } else {
      // for year values
      timeRange = 'customDateRange';
      timeRangeAPIParameter = timePeriod + '-01-01'; // start date
      timeRangeAdditionalData = timePeriod + '-12-31'; // end date
    }

    if (timeRange !== 'customDateRange') {
      timeRangeAPIParameter = true;
      timeRangeAdditionalData = true;
    }

    // configurations for lob
    if (LOB === 'All') {
      isAllLobBool = true;
      iscAndSLobBool = false;
      iseAndILobBool = false;
      ismAndRLobBool = false;
    } else {
      isAllLobBool = false;
      if (LOB === 'Community & State') {
        iscAndSLobBool = true;
        iseAndILobBool = false;
        ismAndRLobBool = false;
      }
      if (LOB === 'Employee & Individual') {
        iscAndSLobBool = false;
        iseAndILobBool = true;
        ismAndRLobBool = false;
      }
      if (LOB === 'Medicare & Retirement') {
        iscAndSLobBool = false;
        iseAndILobBool = false;
        ismAndRLobBool = true;
      }
    }

    if (TIN === 'All') {
      isAllTinBool = true;
      specificTin = '';
    } else {
      isAllTinBool = false;
      specificTin = TIN.replace(/\D/g, '');
      tinNumberFormatted = parseInt(specificTin, 10);
      specificTin = tinNumberFormatted;
    }

    if (serviceSetting === 'All') {
      isAllSSFlagBool = true;
    } else {
      isAllSSFlagBool = false;
    }

    return new Promise(resolve => {
      // const newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];

      const priorAuthAPIParameters = [
        this.providerKey,
        timeRangeAPIParameter,
        timeRangeAdditionalData,
        isAllTinBool,
        specificTin,
        isAllLobBool,
        iscAndSLobBool,
        iseAndILobBool,
        ismAndRLobBool,
        isAllSSFlagBool
      ];
      // Parameters key
      // zero - provider key
      // one/two - time period data
      // three/four - all tin flag/specific tin
      // five-eight - all lob/cAndSLob/eAndILob/mAndRLob flag
      // nine - all service setting flag

      this.priorAuthService
        .getPriorAuthDateRange(timeRange, isAllTinBool, isAllLobBool, isAllSSFlagBool, ...priorAuthAPIParameters)
        .subscribe(
          providerSystems => {
            let PACount = [];
            let PriorAuthBarGraphParamaters = [];
            if (
              providerSystems.PriorAuthorizations !== null &&
              providerSystems.hasOwnProperty('PriorAuthorizations') &&
              providerSystems.PriorAuthorizations.hasOwnProperty('LineOfBusiness')
            ) {
              let data;
              // const data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
              if (isAllLobBool) {
                data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
              } else {
                if (iscAndSLobBool) {
                  data = providerSystems.PriorAuthorizations.LineOfBusiness.CommunityAndState;
                } else if (iseAndILobBool) {
                  data = providerSystems.PriorAuthorizations.LineOfBusiness.EmployerAndIndividual;
                } else if (ismAndRLobBool) {
                  data = providerSystems.PriorAuthorizations.LineOfBusiness.MedicareAndRetirement;
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

              let StandardTATConversion;
              let UrgentTATConversion;
              if (data.StandartPriorAuthTAT / 86400 < 1) {
                StandardTATConversion = '<1';
              } else {
                StandardTATConversion = (data.StandartPriorAuthTAT / 86400).toFixed(0);
              }
              if (data.UrgentPriorAuthTAT / 3600 < 1) {
                UrgentTATConversion = '<1';
              } else {
                UrgentTATConversion = (data.UrgentPriorAuthTAT / 3600).toFixed(0);
              }

              PACount = [
                {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Prior Authorization Requested',
                  data: {
                    graphValues: [PAApprovedCount, PANotApprovedCount, PANotPendingCount, PANotCancelledCount],
                    centerNumber: this.nFormatter(PARequestedCount, 1),
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                    labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                    gdata: ['card-inner', 'PARequested'],
                    hover: true
                  },
                  besideData: {
                    labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  timeperiod: timePeriod
                },
                {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Prior Authorization Approval Rate',
                  data: {
                    graphValues: [PAApprovalRate, 1 - PAApprovalRate],
                    centerNumber: (PAApprovalRate * 100).toFixed(0) + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'PAApprovalRate']
                  },
                  besideData: {
                    verticalData: [
                      { title: 'Average Turnaround Time' },
                      { values: StandardTATConversion + ' Days', labels: 'Standard' },
                      { values: UrgentTATConversion + ' Hours', labels: 'Urgent' }
                    ]
                  },

                  timeperiod: timePeriod
                }
              ];
            } else {
              PACount = [];
            }

            let PriorAuthNotApprovedReasons = [];

            if (isAllLobBool) {
              if (
                providerSystems.All !== null &&
                providerSystems.hasOwnProperty('All') &&
                providerSystems.All.hasOwnProperty('NotApproved')
              ) {
                if (isAllSSFlagBool && providerSystems.All.NotApproved.hasOwnProperty('AllNotApprovedSettings')) {
                  PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.AllNotApprovedSettings;
                } else if (
                  serviceSetting === 'Inpatient' &&
                  providerSystems.All.NotApproved.hasOwnProperty('InPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.InPatient;
                } else if (
                  serviceSetting === 'Outpatient' &&
                  providerSystems.All.NotApproved.hasOwnProperty('OutPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.OutPatient;
                } else if (
                  serviceSetting === 'Outpatient Facility' &&
                  providerSystems.All.NotApproved.hasOwnProperty('OutPatientFacility')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.OutPatientFacility;
                }
              }
            } else if (iscAndSLobBool) {
              if (
                providerSystems.Cs !== null &&
                providerSystems.hasOwnProperty('Cs') &&
                providerSystems.Cs.hasOwnProperty('NotApproved')
              ) {
                if (isAllSSFlagBool && providerSystems.Cs.NotApproved.hasOwnProperty('AllNotApprovedSettings')) {
                  PriorAuthNotApprovedReasons = providerSystems.Cs.NotApproved.AllNotApprovedSettings;
                } else if (
                  serviceSetting === 'Inpatient' &&
                  providerSystems.Cs.NotApproved.hasOwnProperty('InPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Cs.NotApproved.InPatient;
                } else if (
                  serviceSetting === 'Outpatient' &&
                  providerSystems.Cs.NotApproved.hasOwnProperty('OutPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Cs.NotApproved.OutPatient;
                } else if (
                  serviceSetting === 'Outpatient Facility' &&
                  providerSystems.Cs.NotApproved.hasOwnProperty('OutPatientFacility')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Cs.NotApproved.OutPatientFacility;
                }
              }
            } else if (iseAndILobBool) {
              if (
                providerSystems.Ei !== null &&
                providerSystems.hasOwnProperty('Ei') &&
                providerSystems.Ei.hasOwnProperty('NotApproved')
              ) {
                if (isAllSSFlagBool && providerSystems.Ei.NotApproved.hasOwnProperty('AllNotApprovedSettings')) {
                  PriorAuthNotApprovedReasons = providerSystems.Ei.NotApproved.AllNotApprovedSettings;
                } else if (
                  serviceSetting === 'Inpatient' &&
                  providerSystems.Ei.NotApproved.hasOwnProperty('InPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Ei.NotApproved.InPatient;
                } else if (
                  serviceSetting === 'Outpatient' &&
                  providerSystems.Ei.NotApproved.hasOwnProperty('OutPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Ei.NotApproved.OutPatient;
                } else if (
                  serviceSetting === 'Outpatient Facility' &&
                  providerSystems.Ei.NotApproved.hasOwnProperty('OutPatientFacility')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Ei.NotApproved.OutPatientFacility;
                }
              }
            } else if (ismAndRLobBool) {
              if (
                providerSystems.Mr !== null &&
                providerSystems.hasOwnProperty('Mr') &&
                providerSystems.Mr.hasOwnProperty('NotApproved')
              ) {
                if (isAllSSFlagBool && providerSystems.Mr.NotApproved.hasOwnProperty('AllNotApprovedSettings')) {
                  PriorAuthNotApprovedReasons = providerSystems.Mr.NotApproved.AllNotApprovedSettings;
                } else if (
                  serviceSetting === 'Inpatient' &&
                  providerSystems.Mr.NotApproved.hasOwnProperty('InPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Mr.NotApproved.InPatient;
                } else if (
                  serviceSetting === 'Outpatient' &&
                  providerSystems.Mr.NotApproved.hasOwnProperty('OutPatient')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Mr.NotApproved.OutPatient;
                } else if (
                  serviceSetting === 'Outpatient Facility' &&
                  providerSystems.Mr.NotApproved.hasOwnProperty('OutPatientFacility')
                ) {
                  PriorAuthNotApprovedReasons = providerSystems.Mr.NotApproved.OutPatientFacility;
                }
              }
            }

            if (PriorAuthNotApprovedReasons.length > 0) {
              PriorAuthNotApprovedReasons.sort(function(a, b) {
                return b.Count - a.Count;
              });

              const barScaleMax = PriorAuthNotApprovedReasons[0].Count;
              for (let i = 0; i < PriorAuthNotApprovedReasons.length; i++) {
                PriorAuthBarGraphParamaters.push({
                  type: 'singleBarChart',
                  title: 'Top Reasons for Prior Authorizations Not Approved',
                  data: {
                    barHeight: 40,
                    barData: PriorAuthNotApprovedReasons[i].Count,
                    barSummation: barScaleMax,
                    barText: PriorAuthNotApprovedReasons[i].Reason,
                    color: [{ color1: '#3381FF' }],
                    gdata: ['card-inner-large', 'reasonBar' + i]
                  },
                  timeperiod: timePeriod
                });
              }
            } else {
              PriorAuthBarGraphParamaters = [];
            }

            const PAData = [PACount, PriorAuthBarGraphParamaters];
            resolve(PAData);
          },
          err => {
            console.log('Prior Auth Error', err);
          }
        );
    });
  }
}
