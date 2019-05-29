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
    this.providerKey = this.session.providerkey;
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
                  centerNumber: '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                  color: ['#3381FF', '#80B0FF', '#003DA1'],
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: 'down',
                    data: '-2.8%'
                  }
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
                  centerNumber: '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied),
                  color: ['#3381FF', '#80B0FF', '#003DA1'],
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: 'down',
                    data: '-10.2%'
                  }
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
                  centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
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
                  centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate + '%',
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
                  }
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
              appealsData.LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount')
            ) {
              const overturnedData = [
                appealsData.LineOfBusiness[lobFullData].OverTurnCount,
                100 - appealsData.LineOfBusiness[lobFullData].OverTurnCount
              ];
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Appeals Overturned',
                data: {
                  graphValues: overturnedData,
                  centerNumber: appealsData.LineOfBusiness[lobFullData].OverTurnCount,
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
                    centerNumber: '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    }
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
                    centerNumber: '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied),
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsNotPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-10.2%'
                    }
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
                    centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
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
                    centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate + '%',
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
                    centerNumber:
                      appealsData.LineOfBusiness[lobFullData].AdminAppeals +
                      appealsData.LineOfBusiness[lobFullData].ClinicalAppeals,
                    color: ['#3381FF', '#80B0FF', '#003DA1'],
                    gdata: ['card-inner', 'claimsAppealSubmitted'],
                    sdata: {
                      sign: 'up',
                      data: '+4%'
                    }
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
                appealsData.LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount')
              ) {
                const overturnedData = [
                  appealsData.LineOfBusiness[lobFullData].OverTurnCount,
                  100 - appealsData.LineOfBusiness[lobFullData].OverTurnCount
                ];
                appealsOverturned = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Appeals Overturned',
                  data: {
                    graphValues: overturnedData,
                    centerNumber: appealsData.LineOfBusiness[lobFullData].OverTurnCount,
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
      this.providerKey = this.session.providerkey;
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
        parameters.timeperiod = 'rolling12months';
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

  /* function to get Claims Non Payments by Facility Data - Ranjith kumar Ankam*/
  public getClaimsNonPaymentsbyFacilityData(top5Reasons) {
    return new Promise((resolve, reject) => {
      this.tin = this.session.tin;
      this.lob = this.session.lob;
      // this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months'; // need to remove this, and uncomment above line
      this.providerKey = this.session.providerkey;
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
      const timePeriod = 'Last 6 Months';
      this.providerKey = this.session.providerkey;
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

        if (timePeriod === 'Last 12 Months') {
          parameters.timeperiod = 'rolling12months';
        } else if (timePeriod === 'Last 6 Months') {
          parameters.timeperiod = 'last6months';
        } else if (timePeriod === 'Year To Date') {
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
          /* filter_data_claimSummary = summaryData[0].sort(function(a, b) {
            a = a.ReportingPeriod.split('-').join('');
            b = b.ReportingPeriod.split('-').join('');
            console.log('a, b', a, b);
            return a > b ? 1 : a < b ? -1 : 0;
          });
          console.log(filter_data_claimSummary);
          const monthlyTrend = [];
          let monString = '';
          for (let i = 0; i < filter_data_claimSummary.length; i++) {
            monString = filter_data_claimSummary[i].ReportingPeriod.split('-')[1];
            console.log(monString, this.nonPaymentBy);
            if (this.nonPaymentBy === 'volume') {
              monthlyTrend.push({
                name: this.ReturnMonthlyString(monString),
                value: filter_data_claimSummary[i][lobData]['ClaimsLobSummary'][0].ClaimsDenied
              });
            } else if (this.nonPaymentBy === 'dollar') {
              monthlyTrend.push({
                name: this.ReturnMonthlyString(monString),
                value: filter_data_claimSummary[i][lobData]['ClaimsLobSummary'][0].AmountDenied
              });
            }
          }
          console.log('final array', monthlyTrend);*/
        });
      });
    });
  }

  public sentenceCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
