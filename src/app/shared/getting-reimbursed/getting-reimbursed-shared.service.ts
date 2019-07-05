/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
@Injectable({
  providedIn: GettingReimbursedModule
})
export class GettingReimbursedSharedService {
  private tin: string;
  private lob: string;
  private timeFrame: string;
  private providerKey: number;
  private nonPaymentBy: string;
  constructor(
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}

  public ReturnMonthlyString(a) {
    if (a === '01') {
      return 'Jan';
    } else if (a === '02') {
      return 'Feb';
    } else if (a === '03') {
      return 'Mar';
    } else if (a === '04') {
      return 'Apr';
    } else if (a === '05') {
      return 'May';
    } else if (a === '06') {
      return 'Jun';
    } else if (a === '07') {
      return 'Jul';
    } else if (a === '08') {
      return 'Aug';
    } else if (a === '09') {
      return 'Sep';
    } else if (a === '10') {
      return 'Oct';
    } else if (a === '11') {
      return 'Nov';
    } else if (a === '12') {
      return 'Dec';
    }
  }

  public getGettingReimbursedData() {
    this.tin = this.session.tin;
    this.lob = this.session.lob;
    this.timeFrame = this.session.timeFrame;
    this.providerKey = this.session.providerKey();
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      let parameters;
      let appeals: object;
      let payments: object;
      let nonpayments: object;
      let submissions: object;
      let claimsSubmitted: object;
      let claimsTAT: object;
      let appealsSubmitted: object;
      let appealsOverturned: object;
      let claimsNotPaid: object;
      let claimsNotPaidRate: object;
      let claimsPaid: object;
      let claimsPaidRate: object;
      let strtDate: string;
      let endDate: string;

      if (this.timeFrame === 'Last 12 Months' || this.timeFrame === 'Year To Date') {
        if (this.timeFrame === 'Last 12 Months') {
          this.timeFrame = 'Last 6 Months';
          parameters = [this.providerKey, true];
          if (this.tin !== 'All') {
            parameters = [this.providerKey, true, false, this.tin];
          }
        } else if (this.timeFrame === 'Year To Date') {
          parameters = [this.providerKey, false, true];
          if (this.tin !== 'All') {
            parameters = [this.providerKey, false, true, this.tin];
          }
        }

        this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(([claimsData, appealsData]) => {
          console.log(claimsData);
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (claimsData != null && claimsData.hasOwnProperty('status')) {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: claimsData.status,
              title: 'Total Claims Submitted',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: claimsData.status,
              title: 'Claims Average Turnaround Time to Payment',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: claimsData.status,
              title: 'Claims Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: claimsData.status,
              title: 'Claims Yield',
              data: null,
              timeperiod: null
            };
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: claimsData.status,
              title: 'Claims Not Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: claimsData.status,
              title: 'Claims Non-Payment Rate',
              data: null,
              timeperiod: null
            };
          } else if (claimsData != null) {
            this.timeFrame = 'Last 6 Months';

            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
            ) {
              claimsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Total Claims Submitted',
                toggle: this.toggle.setToggles(
                  'Total Claims Submitted',
                  'Claims Submissions',
                  'Getting Reimbursed',
                  true
                ),
                data: {
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                  ],
                  centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
                  color: ['#3381FF', '#80B0FF'],
                  gdata: ['card-inner', 'totalClaimsSubmitted'],
                  sdata: {
                    sign: 'up',
                    data: '+8%'
                  },
                  labels: ['Paid', 'Not Paid'],
                  hover: true
                },
                besideData: {
                  labels: ['Paid', 'Not Paid'],
                  color: ['#3381FF', '#80B0FF']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: null,
                data: null,
                besideData: null,
                timeperiod: this.timeFrame
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('DosToReceived') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ReceivedToPaid')
            ) {
              claimsTAT = {
                category: 'app-card',
                type: 'rotateWithLabel',
                title: 'Claims Average Turnaround Time to Payment',
                toggle: this.toggle.setToggles(
                  'Claims Average Turnaround Time to Payment',
                  'Claims Submissions',
                  'Getting Reimbursed',
                  true
                ),
                data: {
                  centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsAvgTat,
                  color: ['#3381FF', '#3381FF'],
                  gdata: ['card-inner', 'claimsAverageTurnAround'],
                  sdata: {
                    sign: 'down',
                    data: '-1.2%'
                  }
                },
                besideData: {
                  verticalData: [
                    { values: claimsData[lobData].ClaimsLobSummary[0].DosToReceived, labels: 'DOS to Received' },
                    { values: claimsData[lobData].ClaimsLobSummary[0].ReceivedToPaid, labels: 'Received to Paid' }
                  ]
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsTAT = {
                category: 'app-card',
                type: 'rotateWithLabel',
                title: 'Claims Average Turnaround Time to Payment',
                data: null,
                besideData: null,
                timeperiod: this.timeFrame
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
              claimsData.hasOwnProperty('Cs') &&
              claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Cs.ClaimsLobSummary.length &&
              claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
              claimsData.hasOwnProperty('Ei') &&
              claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Ei.ClaimsLobSummary.length &&
              claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
              claimsData.hasOwnProperty('Mr') &&
              claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Mr.ClaimsLobSummary.length &&
              claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid')
            ) {
              const paidData = [
                claimsData.Mr.ClaimsLobSummary[0].ClaimsPaid,
                claimsData.Cs.ClaimsLobSummary[0].ClaimsPaid,
                claimsData.Ei.ClaimsLobSummary[0].ClaimsPaid
              ];
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                  color: ['#3381FF', '#80B0FF', '#003DA1'],
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: 'down',
                    data: '-2.8%'
                  },
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  color: ['#3381FF', '#80B0FF', '#003DA1']
                },
                timeperiod: this.timeFrame
              };
              // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
              if (!paidData[0] && !paidData[1] && !paidData[2]) {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  data: {
                    graphValues: [0, 100],
                    centerNumber:
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) < 1 &&
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) > 0
                        ? '< $1'
                        : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                    color: ['#D7DCE1', '#D7DCE1'],
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    labels: ['Medicare &  Retirement', 'Community & State', 'Employer & Individual'],
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    color: ['#3381FF', '#80B0FF', '#003DA1']
                  },
                  timeperiod: this.timeFrame
                };
              } // Date : 31/5/2019
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: null,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied &&
              claimsData.hasOwnProperty('Cs') &&
              claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Cs.ClaimsLobSummary.length &&
              claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
              claimsData.hasOwnProperty('Ei') &&
              claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Ei.ClaimsLobSummary.length &&
              claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
              claimsData.hasOwnProperty('Mr') &&
              claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
              claimsData.Mr.ClaimsLobSummary.length &&
              claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
            ) {
              const nonPaidData = [
                claimsData.Mr.ClaimsLobSummary[0].ClaimsDenied,
                claimsData.Cs.ClaimsLobSummary[0].ClaimsDenied,
                claimsData.Ei.ClaimsLobSummary[0].ClaimsDenied
              ];
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied),
                  color: ['#3381FF', '#80B0FF', '#003DA1'],
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: 'down',
                    data: '-10.2%'
                  },
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  color: ['#3381FF', '#80B0FF', '#003DA1']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: null,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Non-Payment Rate',
                data: {
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate
                  ],
                  centerNumber:
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                      ? '< 1%'
                      : claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsNonPaymentRate'],
                  sdata: {
                    sign: 'up',
                    data: '+3.7%'
                  }
                },
                timeperiod: this.timeFrame
              };
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Yield',
                data: {
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate
                  ],
                  centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsYield'],
                  sdata: {
                    sign: 'up',
                    data: '+5.3%'
                  }
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                timeperiod: null
              };
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                timeperiod: null
              };
            }
          }
          if (appealsData != null && appealsData.hasOwnProperty('status')) {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabelBottom',
              status: appealsData.status,
              title: 'Claims Appeals Submitted',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            appealsOverturned = {
              category: 'app-card',
              type: 'donut',
              status: appealsData.status,
              title: 'Claims Appeals Overturned',
              data: null,
              timeperiod: null
            };
          } else if (appealsData != null) {
            if (
              appealsData.hasOwnProperty('LineOfBusiness') &&
              appealsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
              appealsData.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
              appealsData.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
              appealsData.LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
              appealsData.LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
              appealsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
              appealsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
              appealsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
              appealsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals')
            ) {
              const submittedData = [
                appealsData.LineOfBusiness.MedicareAndRetirement.AdminAppeals +
                  appealsData.LineOfBusiness.MedicareAndRetirement.ClinicalAppeals,
                appealsData.LineOfBusiness.CommunityAndState.AdminAppeals +
                  appealsData.LineOfBusiness.CommunityAndState.ClinicalAppeals,
                appealsData.LineOfBusiness.EmployerAndIndividual.AdminAppeals +
                  appealsData.LineOfBusiness.EmployerAndIndividual.ClinicalAppeals
              ];
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabelBottom',
                title: 'Claims Appeals Submitted',
                data: {
                  graphValues: submittedData,
                  centerNumber: this.common.nFormatter(
                    appealsData.LineOfBusiness[lobFullData].AdminAppeals +
                      appealsData.LineOfBusiness[lobFullData].ClinicalAppeals
                  ),
                  color: ['#3381FF', '#80B0FF', '#003DA1'],
                  gdata: ['card-inner', 'claimsAppealSubmitted'],
                  sdata: {
                    sign: 'up',
                    data: '+4%'
                  },
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                  color: ['#3381FF', '#80B0FF', '#003DA1']
                },
                bottomData: {
                  horizontalData: [
                    { values: appealsData.LineOfBusiness[lobFullData].AdminAppeals, labels: 'Admin' },
                    { values: appealsData.LineOfBusiness[lobFullData].ClinicalAppeals, labels: 'Clinical' }
                  ]
                },
                timeperiod: this.timeFrame
              };
            } else {
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabelBottom',
                title: null,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              appealsData.hasOwnProperty('LineOfBusiness') &&
              appealsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
            ) {
              const submitted =
                appealsData.LineOfBusiness[lobFullData].AdminAppeals +
                appealsData.LineOfBusiness[lobFullData].ClinicalAppeals;
              const overturnedData = [
                appealsData.LineOfBusiness[lobFullData].OverTurnCount,
                submitted - appealsData.LineOfBusiness[lobFullData].OverTurnCount
              ];
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Appeals Overturned',
                data: {
                  graphValues: overturnedData,
                  centerNumber: this.common.nFormatter(appealsData.LineOfBusiness[lobFullData].OverTurnCount),
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsAppealOverturned'],
                  sdata: {
                    sign: 'up',
                    data: '+2.3%'
                  }
                },
                timeperiod: this.timeFrame
              };
            } else {
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                timeperiod: null
              };
            }
          }
          submissions = { id: 1, title: 'Claims Submissions', data: [claimsSubmitted, claimsTAT] };
          payments = { id: 2, title: 'Claims Payments', data: [claimsPaid, claimsPaidRate] };
          nonpayments = { id: 3, title: 'Claims Non-Payments', data: [claimsNotPaid, claimsNotPaidRate] };
          appeals = {
            id: 4,
            title: 'Claims Appeals',
            data: [appealsSubmitted, appealsOverturned]
          };
          summaryData[0] = submissions;
          summaryData[1] = payments;
          summaryData[2] = nonpayments;
          summaryData[3] = appeals;
          if (summaryData.length) {
            resolve(summaryData);
          }
        });
      } else {
        strtDate = this.common.matchTimePeriodWithJSON(this.timeFrame) + '-01';
        endDate = this.common.matchTimePeriodWithJSON(this.timeFrame) + '-12';

        if (this.tin !== 'All') {
          parameters = [
            this.providerKey,
            true,
            strtDate,
            endDate,
            this.common.matchTimePeriodWithJSON(this.timeFrame),
            this.tin
          ];
        } else {
          parameters = [this.providerKey, true, strtDate, endDate, this.common.matchTimePeriodWithJSON(this.timeFrame)];
        }
        this.gettingReimbursedService
          .getGettingReimbursedYearWiseData(...parameters)
          .subscribe(([claimsData, appealsData]) => {
            const lobFullData = this.common.matchFullLobWithData(this.lob);
            const lobData = this.common.matchLobWithData(this.lob);
            if (claimsData != null && claimsData.hasOwnProperty('status')) {
              claimsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: claimsData.status,
                title: 'Total Claims Submitted',
                data: null,
                besideData: null,
                timeperiod: null
              };
              claimsTAT = {
                category: 'app-card',
                type: 'rotateWithLabel',
                status: claimsData.status,
                title: 'Claims Average Turnaround Time to Payment',
                data: null,
                besideData: null,
                timeperiod: null
              };
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: claimsData.status,
                title: 'Claims Paid',
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                status: claimsData.status,
                title: 'Claims Yield',
                data: null,
                timeperiod: null
              };
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: claimsData.status,
                title: 'Claims Not Paid',
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                status: claimsData.status,
                title: 'Claims Non-Payment Rate',
                data: null,
                timeperiod: null
              };
            } else if (claimsData != null) {
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
              ) {
                claimsSubmitted = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Total Claims Submitted',
                  data: {
                    graphValues: [
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                    ],
                    centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
                    color: ['#3381FF', '#80B0FF'],
                    gdata: ['card-inner', 'totalClaimsSubmitted'],
                    sdata: {
                      sign: 'up',
                      data: '+8%'
                    }
                  },
                  besideData: {
                    labels: ['Paid', 'Not Paid'],
                    color: ['#3381FF', '#80B0FF']
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                claimsSubmitted = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: null,
                  data: null,
                  besideData: null,
                  timeperiod: this.timeFrame
                };
              }
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat') &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('DosToReceived') &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ReceivedToPaid')
              ) {
                claimsTAT = {
                  category: 'app-card',
                  type: 'rotateWithLabel',
                  title: 'Claims Average Turnaround Time to Payment',
                  data: {
                    centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsAvgTat,
                    color: ['#3381FF', '#3381FF'],
                    gdata: ['card-inner', 'claimsAverageTurnAround'],
                    sdata: {
                      sign: 'down',
                      data: '-1.2%'
                    }
                  },
                  besideData: {
                    verticalData: [
                      { values: claimsData[lobData].ClaimsLobSummary[0].DosToReceived, labels: 'DOS to Received' },
                      { values: claimsData[lobData].ClaimsLobSummary[0].ReceivedToPaid, labels: 'Received to Paid' }
                    ]
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                claimsTAT = {
                  category: 'app-card',
                  type: 'rotateWithLabel',
                  title: 'Claims Average Turnaround Time to Payment',
                  data: null,
                  besideData: null,
                  timeperiod: this.timeFrame
                };
              }
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
                claimsData.hasOwnProperty('Cs') &&
                claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Cs.ClaimsLobSummary.length &&
                claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
                claimsData.hasOwnProperty('Ei') &&
                claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Ei.ClaimsLobSummary.length &&
                claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
                claimsData.hasOwnProperty('Mr') &&
                claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Mr.ClaimsLobSummary.length &&
                claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid')
              ) {
                const paidData = [
                  claimsData.Mr.ClaimsLobSummary[0].ClaimsPaid,
                  claimsData.Cs.ClaimsLobSummary[0].ClaimsPaid,
                  claimsData.Ei.ClaimsLobSummary[0].ClaimsPaid
                ];
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  data: {
                    graphValues: paidData,
                    centerNumber:
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) < 1 &&
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid) > 0
                        ? '< $1'
                        : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    color: ['#3381FF', '#80B0FF', '#003DA1']
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: null,
                  data: null,
                  besideData: null,
                  bottomData: null,
                  timeperiod: null
                };
              }
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied &&
                claimsData.hasOwnProperty('Cs') &&
                claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Cs.ClaimsLobSummary.length &&
                claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
                claimsData.hasOwnProperty('Ei') &&
                claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Ei.ClaimsLobSummary.length &&
                claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
                claimsData.hasOwnProperty('Mr') &&
                claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                claimsData.Mr.ClaimsLobSummary.length &&
                claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
              ) {
                const nonPaidData = [
                  claimsData.Mr.ClaimsLobSummary[0].ClaimsDenied,
                  claimsData.Cs.ClaimsLobSummary[0].ClaimsDenied,
                  claimsData.Ei.ClaimsLobSummary[0].ClaimsDenied
                ];
                claimsNotPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Not Paid',
                  data: {
                    graphValues: nonPaidData,
                    centerNumber:
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied) < 1 &&
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied) > 0
                        ? '< $1'
                        : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied),
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsNotPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-10.2%'
                    },
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    color: ['#3381FF', '#80B0FF', '#003DA1']
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                claimsNotPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: null,
                  data: null,
                  besideData: null,
                  bottomData: null,
                  timeperiod: null
                };
              }
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
              ) {
                claimsNotPaidRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Non-Payment Rate',
                  data: {
                    graphValues: [
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate,
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate
                    ],
                    centerNumber:
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                        ? '< 1%'
                        : claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                    color: ['#3381FF', '#D7DCE1'],
                    gdata: ['card-inner', 'claimsNonPaymentRate'],
                    sdata: {
                      sign: 'up',
                      data: '+3.7%'
                    }
                  },
                  timeperiod: this.timeFrame
                };
                claimsPaidRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Yield',
                  data: {
                    graphValues: [
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate,
                      claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate
                    ],
                    centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() + '%',
                    color: ['#3381FF', '#D7DCE1'],
                    gdata: ['card-inner', 'claimsYield'],
                    sdata: {
                      sign: 'up',
                      data: '+5.3%'
                    }
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                claimsNotPaidRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: null,
                  data: null,
                  timeperiod: null
                };
                claimsPaidRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: null,
                  data: null,
                  timeperiod: null
                };
              }
            }
            if (appealsData != null && appealsData.hasOwnProperty('status')) {
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabelBottom',
                status: appealsData.status,
                title: 'Claims Appeals Submitted',
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                status: appealsData.status,
                title: 'Claims Appeals Overturned',
                data: null,
                timeperiod: null
              };
            } else if (appealsData != null) {
              if (
                appealsData.hasOwnProperty('LineOfBusiness') &&
                appealsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
                appealsData.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
                appealsData.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
                appealsData.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
                appealsData.LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
                appealsData.LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
                appealsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
                appealsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
                appealsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
                appealsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals')
              ) {
                const submittedData = [
                  appealsData.LineOfBusiness.MedicareAndRetirement.AdminAppeals +
                    appealsData.LineOfBusiness.MedicareAndRetirement.ClinicalAppeals,
                  appealsData.LineOfBusiness.CommunityAndState.AdminAppeals +
                    appealsData.LineOfBusiness.CommunityAndState.ClinicalAppeals,
                  appealsData.LineOfBusiness.EmployerAndIndividual.AdminAppeals +
                    appealsData.LineOfBusiness.EmployerAndIndividual.ClinicalAppeals
                ];
                appealsSubmitted = {
                  category: 'app-card',
                  type: 'donutWithLabelBottom',
                  title: 'Claims Appeals Submitted',
                  data: {
                    graphValues: submittedData,
                    centerNumber: this.common.nFormatter(
                      appealsData.LineOfBusiness[lobFullData].AdminAppeals +
                        appealsData.LineOfBusiness[lobFullData].ClinicalAppeals
                    ),
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsAppealSubmitted'],
                    sdata: {
                      sign: 'up',
                      data: '+4%'
                    },
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                    color: ['#3381FF', '#80B0FF', '#003DA1']
                  },
                  bottomData: {
                    horizontalData: [
                      { values: appealsData.LineOfBusiness[lobFullData].AdminAppeals, labels: 'Admin' },
                      { values: appealsData.LineOfBusiness[lobFullData].ClinicalAppeals, labels: 'Clinical' }
                    ]
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                appealsSubmitted = {
                  category: 'app-card',
                  type: 'donutWithLabelBottom',
                  title: null,
                  data: null,
                  besideData: null,
                  bottomData: null,
                  timeperiod: null
                };
              }
              if (
                appealsData.hasOwnProperty('LineOfBusiness') &&
                appealsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
              ) {
                const submitted =
                  appealsData.LineOfBusiness[lobFullData].AdminAppeals +
                  appealsData.LineOfBusiness[lobFullData].ClinicalAppeals;
                const overturnedData = [
                  appealsData.LineOfBusiness[lobFullData].OverTurnCount,
                  submitted - appealsData.LineOfBusiness[lobFullData].OverTurnCount
                ];
                appealsOverturned = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Appeals Overturned',
                  data: {
                    graphValues: overturnedData,
                    centerNumber: this.common.nFormatter(appealsData.LineOfBusiness[lobFullData].OverTurnCount),
                    color: ['#3381FF', '#D7DCE1'],
                    gdata: ['card-inner', 'claimsAppealOverturned'],
                    sdata: {
                      sign: 'up',
                      data: '+2.3%'
                    }
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                appealsOverturned = {
                  category: 'app-card',
                  type: 'donut',
                  title: null,
                  data: null,
                  timeperiod: null
                };
              }
            }
            submissions = { id: 1, title: 'Claims Submissions', data: [claimsSubmitted, claimsTAT] };
            payments = { id: 2, title: 'Claims Payments', data: [claimsPaid, claimsPaidRate] };
            nonpayments = { id: 3, title: 'Claims Non-Payments', data: [claimsNotPaid, claimsNotPaidRate] };
            appeals = { id: 4, title: 'Claims Appeals', data: [appealsSubmitted, appealsOverturned] };
            summaryData[0] = submissions;
            summaryData[1] = payments;
            summaryData[2] = nonpayments;
            summaryData[3] = appeals;
            if (summaryData.length) {
              resolve(summaryData);
            }
          });
      }
    });
  }

  /* function to get Top Reasons for Claims Non Payments - Ranjith kumar Ankam*/
  public getTopReasonsforClaimsNonPayments() {
    return new Promise((resolve, reject) => {
      this.tin = this.session.tin;
      this.lob = this.session.lob;
      // this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months'; // need to remove this, and uncomment above line
      this.providerKey = this.session.providerKey();
      const parameters = {
        providerkey: this.providerKey,
        timeperiod: '',
        ytd: false,
        tin: '',
        startDate: '',
        endDate: '',
        monthly: false
      };
      if (this.timeFrame === 'Last 12 Months') {
        this.timeFrame = 'Last 6 Months';
        parameters.timeperiod = 'last6months';
      } else if (this.timeFrame === 'Last 6 Months') {
        parameters.timeperiod = 'last6months';
      } else if (this.timeFrame === 'Year To Date') {
        parameters.ytd = true;
      }
      this.gettingReimbursedService.getClaimsNonPaymentsData(parameters).subscribe(data => {
        const result = [];
        if (data[0].All !== null) {
          data[0].All.DenialCategory.forEach(element => {
            if (element.Claimdenialcategorylevel1shortname !== '') {
              result.push({
                Claimdenialcategorylevel1shortname: this.sentenceCase(element.Claimdenialcategorylevel1shortname),
                DenialAmount: element.DenialAmount
              });
            }
          });
          result.sort((a, b) => parseFloat(b.DenialAmount) - parseFloat(a.DenialAmount));
          resolve(result.slice(0, 5));
        } else {
          resolve(result);
        }
      });
    });
  }

  public getTins() {
    return new Promise((resolve, reject) => {
      this.providerKey = this.session.providerKey();
      this.gettingReimbursedService.getTins(this.providerKey).subscribe(tins => {
        const providerTins = tins;
        resolve(providerTins);
      });
    });
  }
  /* function to get Claims Non Payments by Facility Data - Ranjith kumar Ankam*/
  public getClaimsNonPaymentsbyFacilityData(top5Reasons) {
    return new Promise((resolve, reject) => {
      this.tin = this.session.tin;
      this.lob = this.session.lob;
      // this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months'; // need to remove this, and uncomment above line
      this.providerKey = this.session.providerKey();
      this.gettingReimbursedService.getTins(this.providerKey).subscribe(tins => {
        const providerTins = tins;
        const parameters = {
          providerkey: this.providerKey,
          timeperiod: '',
          ytd: false,
          tin: '0',
          startDate: '',
          endDate: '',
          monthly: false
        };
        const output: any = [];
        const response: any = [];

        if (this.timeFrame === 'Last 12 Months') {
          this.timeFrame = 'Last 6 Months';
          parameters.timeperiod = 'rolling12months';
        } else if (this.timeFrame === 'Last 6 Months') {
          parameters.timeperiod = 'last6months';
        } else if (this.timeFrame === 'Year To Date') {
          parameters.ytd = true;
        }
        if (this.tin !== 'All') {
          parameters.tin = this.tin;
        }

        this.gettingReimbursedService.getClaimsNonPaymentsData(parameters).subscribe(nonPaymentsByFacilitydata => {
          this.nonPaymentBy = this.session.nonPaymentBy;
          nonPaymentsByFacilitydata.forEach(element => {
            const indObject: any = {};
            indObject.tin = element.Tin;
            providerTins.forEach(tin => {
              if (element.Tin === tin.Tin) {
                indObject.tinname = this.sentenceCase(tin.Tinname);
              }
            });
            const reasons = [];
            if (element.All !== null) {
              element.All.DenialCategory.forEach(top5 => {
                if (top5Reasons.includes(this.sentenceCase(top5.Claimdenialcategorylevel1shortname))) {
                  if (this.nonPaymentBy === 'dollar') {
                    reasons.push({
                      denialCategory: this.sentenceCase(top5.Claimdenialcategorylevel1shortname),
                      val: '$' + this.common.nFormatter(top5.DenialAmount)
                    });
                  } else if (this.nonPaymentBy === 'volume') {
                    reasons.push({
                      denialCategory: this.sentenceCase(top5.Claimdenialcategorylevel1shortname),
                      val: this.common.nFormatter(top5.DenialCount)
                    });
                  } else if (this.nonPaymentBy === 'average') {
                    reasons.push({
                      denialCategory: this.sentenceCase(top5.Claimdenialcategorylevel1shortname),
                      val: '$' + this.common.nFormatter(top5.DenialCount / top5.DenialCount)
                    });
                  }
                }
              });
            } else {
              resolve([]);
            }
            indObject.reasons = reasons;
            output.push(indObject);
          });
          output.forEach(element => {
            const result: any = {};
            result.tin = element.tin;
            result.facilityName = element.tinname;
            element.reasons.forEach(el => {
              result[el.denialCategory] = el.val;
            });
            response.push(result);
          });
          resolve(response);
        });
      });
    });
  }

  public getclaimsNonPaymentTrendData() {
    return new Promise((resolve, reject) => {
      this.tin = this.session.tin;
      this.lob = this.session.lob;
      // this.timeFrame = 'Last 12 Months'; // this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months';
      this.providerKey = this.session.providerKey();
      this.gettingReimbursedService.getTins(this.providerKey).subscribe(tins => {
        const providerTins = tins;
        const parameters = {
          providerkey: this.providerKey,
          timeperiod: '',
          ytd: false,
          tin: '',
          startDate: '',
          endDate: '',
          monthly: true
        };
        this.nonPaymentBy = 'dollar';
        const output: any = [];
        const response: any = [];

        if (this.timeFrame === 'Last 12 Months') {
          this.timeFrame = 'Last 6 Months';
          parameters.timeperiod = 'rolling12months';
        } else if (this.timeFrame === 'Last 6 Months') {
          parameters.timeperiod = 'last6months';
        } else if (this.timeFrame === 'Year To Date') {
          parameters.ytd = true;
        }
        if (this.tin !== 'All') {
          parameters.tin = this.tin;
        }

        this.gettingReimbursedService.getClaimsNonPaymentsData(parameters).subscribe(nonPaymentsTrendData => {
          const lobData = this.lob;
          const filter_data_claimSummary = [];
          let trendMonthValue = '';
          nonPaymentsTrendData.forEach(element => {
            if (this.nonPaymentBy === 'dollar') {
              trendMonthValue = element.All.ClaimsLobSummary[0].AmountDenied;
            } else if (this.nonPaymentBy === 'volume') {
              trendMonthValue = element.All.ClaimsLobSummary[0].ClaimsDenied;
            }
            const trendTimePeriod = element.ReportingPeriod;
            const trendTimePeriodArr = trendTimePeriod.split('-');
            const trendTimePeriodFinal = trendTimePeriodArr[1];
            // console.log(tpFinal);
            filter_data_claimSummary.push({
              name: this.ReturnMonthlyString(trendTimePeriodFinal),
              value: trendMonthValue,
              month: trendTimePeriod
            });
          });
          filter_data_claimSummary.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });
          filter_data_claimSummary.forEach(function(v) {
            delete v.month;
          });
          resolve(filter_data_claimSummary);
        });
      });
    });
  }
  public getappealsRateAndReasonData() {
    this.tin = this.session.tin;
    this.lob = this.session.lob;
    this.timeFrame = 'Last 6 Months'; // this.session.timeFrame;
    this.providerKey = this.session.providerKey();

    let AOR: Array<Object> = [];
    return new Promise((resolve, reject) => {
      let parameters;
      let appealsOverturnedRate: Object;
      const reason = [];

      parameters = [this.providerKey];
      this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(([claimsData, appealsData]) => {
        const lobFullData = this.common.matchFullLobWithData(this.lob);
        const lobData = this.common.matchLobWithData(this.lob);
        /*  if (appealsData != null && appealsData.hasOwnProperty('status')) {
          appealsOverturnedRate = {
              category: 'app-card',
              type: 'donut',
              status: appealsData.status,
              title: 'Claims Appeals Overturned Rate',
              data: null,
              timeperiod: null
            };
    } else*/ if (
          appealsData != null
        ) {
          if (
            appealsData.hasOwnProperty('LineOfBusiness') &&
            appealsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
            appealsData.LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
            appealsData.LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
            appealsData.LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
          ) {
            const submitted =
              appealsData.LineOfBusiness[lobFullData].AdminAppeals +
              appealsData.LineOfBusiness[lobFullData].ClinicalAppeals;
            const overturned = appealsData.LineOfBusiness[lobFullData].OverTurnCount;

            const overturnRate = ((overturned / submitted) * 100).toFixed(0);
            const ornumber = Number(overturnRate);

            appealsOverturnedRate = [
              {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Appeals Overturned Rate',
                data: {
                  graphValues: [overturnRate, 100 - ornumber],
                  centerNumber: overturnRate + '%',
                  color: ['#3381FF', '#E0E0E0'],
                  gdata: ['card-inner', 'claimsAppealOverturnedRate'],
                  sdata: null
                },
                timeperiod: this.timeFrame
              }
            ];

            const reasonsVal1 = [{}];
            const reasonsVal2 = [{}];
            const barVal = [{}];
            const barTitle = [{}];
            const getTopFiveReasons = appealsData.LineOfBusiness[lobFullData].ListReasonAndCount.sort(function(a, b) {
              return b.Count - a.Count;
            }).slice(0, 5);
            let topFiveReasonTotal;
            for (let i = 0; i < getTopFiveReasons.length; i++) {
              if (i === 0) {
                topFiveReasonTotal = getTopFiveReasons[i].Count;
              } else {
                topFiveReasonTotal = topFiveReasonTotal + getTopFiveReasons[i].Count;
              }
            }
            for (let a = 0; a < getTopFiveReasons.length; a++) {
              reasonsVal1[a] = getTopFiveReasons[a].Count;
              const value1 = Number(reasonsVal1[a]);
              reasonsVal2[a] = topFiveReasonTotal - getTopFiveReasons[a].Count;
              barVal[a] =
                Number(((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed()) >= 1
                  ? ((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed() + '%'
                  : '<1%';
              barTitle[a] = getTopFiveReasons[a].Reason;
            }
            for (let i = 0; i <= getTopFiveReasons.length; i++) {
              reason.push({
                type: 'bar chart',
                graphValues: [reasonsVal1[i], reasonsVal2[i]],
                barText: barTitle[i],
                barValue: barVal[i],
                color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
                gdata: ['app-card-structure', 'appealsOverturnedReason' + i]
              });
            }
          }
        }
        AOR = [appealsOverturnedRate, reason];
        resolve(AOR);
      });
    });
  }

  /* function to get Payment Integrity Card Data - Ranjith kumar Ankam */
  public getPaymentIntegrityData() {
    return new Promise((resolve, reject) => {
      this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months';

      this.providerKey = this.session.providerKey();

      const parameters = {
        providerkey: this.providerKey,
        timeperiod: ''
      };

      /*if (this.timeFrame === 'Last 12 Months') {
        parameters.timeperiod = 'rolling12months';
      } else if (this.timeFrame === 'Last 6 Months') {
        parameters.timeperiod = 'last6months';
      }*/

      this.gettingReimbursedService.getPaymentIntegrityData(parameters).subscribe(r => {
        console.log(r);

        if (r !== null && r !== '') {
          const result: any = r;
          const output: any = {};
          let returnedWidth = 4;
          let notReturnedWidth = 4;

          if (result.MedicalRecordsReturned > result.MedicalRecordsOutstanding) {
            returnedWidth = 382;
            if (result.MedicalRecordsOutstanding !== 0) {
              notReturnedWidth = (result.MedicalRecordsOutstanding * 382) / result.MedicalRecordsReturned;
            }
          } else {
            notReturnedWidth = 382;
            if (result.MedicalRecordsReturned !== 0) {
              returnedWidth = (result.MedicalRecordsReturned * 382) / result.MedicalRecordsOutstanding;
            }
          }

          output.returnedWidth = returnedWidth;
          output.notReturnedWidth = notReturnedWidth;
          output.MedicalRecordsOutstanding = this.common.nFormatter(result.MedicalRecordsOutstanding);
          output.MedicalRecordsRequested = this.common.nFormatter(result.MedicalRecordsRequested);
          output.MedicalRecordsReturned = this.common.nFormatter(result.MedicalRecordsReturned);
          output.OutStandingAmount = '$' + this.common.nFormatter(result.OutStandingAmount);

          if (Math.round(result.OutStandingAmountVariance) > 0) {
            output.OutStandingAmountVarianceColor = '#B10C00';
            output.OutStandingAmountVariance = '+' + Math.round(result.OutStandingAmountVariance * 10) / 10 + '%';
            output.OutStandingAmountVarianceIcon = 'up-red-trend-icon';
          } else {
            output.OutStandingAmountVarianceColor = '#007000';
            output.OutStandingAmountVariance = Math.round(result.OutStandingAmountVariance * 10) / 10 + '%';
            output.OutStandingAmountVarianceIcon = 'down-green-trend-icon';
          }

          output.RecordsRequestedVariance =
            Math.round(result.RecordsRequestedVariance) > 0
              ? '+' + Math.round(result.RecordsRequestedVariance * 10) / 10 + '%'
              : Math.round(result.RecordsRequestedVariance * 10) / 10 + '%';
          output.VarianceStartDate =
            this.getMonthname(result.VarianceStartDate) + ' ' + this.getFullyear(result.VarianceStartDate);
          output.VarianceEndDate =
            this.getMonthname(result.VarianceEndDate) + ' ' + this.getFullyear(result.VarianceEndDate);
          output.timeperiod = this.timeFrame;
          let sData: any = {};
          if (result.RecordsRequestedVariance > 0) {
            sData = { sign: 'down', data: output.RecordsRequestedVariance + '*' };
          } else {
            sData = { sign: 'up', data: output.RecordsRequestedVariance + '*' };
          }
          output.piDonutData = {
            timeperiod: this.timeFrame,
            donutData: {
              centerNumber: this.common.nFormatter(result.MedicalRecordsRequested),
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'piCard'],
              graphValues: [result.MedicalRecordsRequested, result.TotalClaimsSubmitted],
              sdata: sData,
              graphScreen: 'PI'
            },
            besideData: {
              color: ['#3381FF', '#D7DCE1'],
              labels: ['Pre-Payment Records Requested', 'Claims Submitted']
            }
          };
          resolve(output);
        } else {
          resolve(null);
        }
      });
    });
  }

  getclaimsPaidData() {
    this.tin = this.session.tin;
    this.lob = this.session.lob;
    this.timeFrame = 'Last 6 Months'; // this.session.timeFrame;
    this.providerKey = this.session.providerKey();
    const timeperiod = '';

    // let paidArray:  Array<Object> = [];

    return new Promise((resolve, reject) => {
      let parameters;
      parameters = [this.providerKey];
      let paidBreakdown = [];
      let paidArray: Array<Object> = [];
      this.gettingReimbursedService.getPaymentData(parameters).subscribe(paymentData => {
        const lobFullData = this.common.matchFullLobWithData(this.lob);
        const lobData = this.common.matchLobWithData(this.lob);
        if (paymentData !== null) {
          paidBreakdown = [
            paymentData[lobData].ClaimsLobSummary[0].AmountBilled,
            paymentData[lobData].ClaimsLobSummary[0].AmountActualAllowed,
            paymentData[lobData].ClaimsLobSummary[0].AmountDenied,
            paymentData[lobData].ClaimsLobSummary[0].AmountUHCPaid
          ];
        }
        paidArray = [paidBreakdown];
        resolve(paidArray);
      });
    });
  }

  public sentenceCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public getMonthname(dt) {
    const d = new Date(dt);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()];
  }

  public getFullyear(dt) {
    const d = new Date(dt);
    return d.getFullYear();
  }
}
