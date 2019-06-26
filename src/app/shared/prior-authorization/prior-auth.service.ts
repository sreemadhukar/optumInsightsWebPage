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

  public getPCORData() {
    this.providerKey = this.session.providerKey();
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
    this.providerKey = this.session.providerKey();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];
      const timeRange = 'rolling12';
      const isAllTin = true;
      const isAlllob = true;
      const isAllSS = true;

      this.priorAuthService.getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters).subscribe(
        providerSystems => {
          const data = providerSystems.PriorAuthorizations.LineOfBusiness.ALL;
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

          const PACount = [
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
              sdata: {
                sign: null,
                data: null
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
              sdata: {
                sign: null,
                data: null
              },

              timeperiod: 'Last 6 Months'
            }
          ];

          const PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.AllNotApprovedSettings;
          PriorAuthNotApprovedReasons.sort(function(a, b) {
            return b.Count - a.Count;
          });

          const barScaleMax = PriorAuthNotApprovedReasons[0].Count;

          const PriorAuthBarGraphParamaters = [];

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
    this.providerKey = this.session.providerKey();
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
}
