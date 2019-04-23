/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
@Injectable({
  providedIn: GettingReimbursedModule
})
export class GettingReimbursedSharedService {
  private tin: string;
  private lob: string;
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService
  ) {}
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
      if (this.timeFrame === 'Rolling 12 Months' || this.timeFrame === 'Year To Date') {
        if (this.timeFrame === 'Rolling 12 Months') {
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
          if (
            claimsData.hasOwnProperty(lobData) &&
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid &&
            claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied &&
            claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted
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
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
                sdata: {
                  sign: 'up',
                  data: '8%'
                }
              },
              besideData: {
                labels: ['Paid', 'Not Paid'],
                color: ['#3381FF', '#80B0FF']
              },
              timeperiod: this.timeFrame
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              title: 'Claims Average Turnaround Time to Payment',
              data: {
                centerNumber: '24 Days',
                color: ['#3381FF', '#3381FF'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
                sdata: {
                  sign: 'down',
                  data: '-1.2%'
                }
              },
              besideData: {
                values: ['6 Days', '18 Days'],
                labels: ['DOS to Received', 'Received to Paid']
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
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              title: 'Claims Average Turnaround Time to Payment',
              data: {
                centerNumber: '24 Days',
                color: ['#3381FF', '#3381FF'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
                sdata: {
                  sign: 'down',
                  data: '-1.2%'
                }
              },
              besideData: {
                values: ['6 Days', '18 Days'],
                labels: ['DOS to Received', 'Received to Paid']
              },
              timeperiod: this.timeFrame
            };
          }
          if (
            claimsData.hasOwnProperty(lobData) &&
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid &&
            claimsData.hasOwnProperty('Cs') &&
            claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Cs.ClaimsLobSummary.length &&
            claimsData.Cs.ClaimsLobSummary[0].ClaimsPaid &&
            claimsData.hasOwnProperty('Ei') &&
            claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Ei.ClaimsLobSummary.length &&
            claimsData.Ei.ClaimsLobSummary[0].ClaimsPaid &&
            claimsData.hasOwnProperty('Mr') &&
            claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Mr.ClaimsLobSummary.length &&
            claimsData.Mr.ClaimsLobSummary[0].ClaimsPaid
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
                centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid),
                color: ['#3381FF', '#80B0FF', '#003DA1'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
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
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied &&
            claimsData.hasOwnProperty('Cs') &&
            claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Cs.ClaimsLobSummary.length &&
            claimsData.Cs.ClaimsLobSummary[0].ClaimsDenied &&
            claimsData.hasOwnProperty('Ei') &&
            claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Ei.ClaimsLobSummary.length &&
            claimsData.Ei.ClaimsLobSummary[0].ClaimsDenied &&
            claimsData.hasOwnProperty('Mr') &&
            claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
            claimsData.Mr.ClaimsLobSummary.length &&
            claimsData.Mr.ClaimsLobSummary[0].ClaimsDenied
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
                centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied),
                color: ['#3381FF', '#80B0FF', '#003DA1'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
                sdata: {
                  sign: 'down',
                  data: '+10.2%'
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
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].AmountActualAllowed &&
            claimsData[lobData].ClaimsLobSummary[0].AmountExpectedAllowed
          ) {
            const actualAllowed = parseFloat(claimsData[lobData].ClaimsLobSummary[0].AmountActualAllowed);
            const expectedAllowed = parseFloat(claimsData[lobData].ClaimsLobSummary[0].AmountExpectedAllowed);
            const yieldRate = ((actualAllowed / expectedAllowed) * 100).toFixed();
            const denialRate = 100 - parseFloat(yieldRate);
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              title: 'Claims Non-Payment Rate',
              data: {
                graphValues: [denialRate, yieldRate],
                centerNumber: denialRate + '%',
                color: ['#3381FF', '#F5F5F5'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
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
                graphValues: [yieldRate, denialRate],
                centerNumber: yieldRate + '%',
                color: ['#3381FF', '#F5F5F5'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
                sdata: {
                  sign: 'up',
                  data: '+2.3%'
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
          }
          if (
            appealsData.hasOwnProperty('LineOfBusiness') &&
            appealsData.LineOfBusiness.hasOwnProperty(lobData) &&
            appealsData.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
            appealsData.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
            appealsData.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
            appealsData.LineOfBusiness[lobData].hasOwnProperty('AdminAppeals') &&
            appealsData.LineOfBusiness[lobData].hasOwnProperty('ClinicalAppeals') &&
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
                  appealsData.LineOfBusiness[lobData].AdminAppeals +
                  appealsData.LineOfBusiness[lobData].ClinicalAppeals,
                color: ['#3381FF', '#80B0FF', '#003DA1'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
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
                  { values: appealsData.LineOfBusiness[lobData].AdminAppeals, labels: 'Admin' },
                  { values: appealsData.LineOfBusiness[lobData].ClinicalAppeals, labels: 'Clinical' }
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
                color: ['#3381FF', '#F5F5F5'],
                gdata: ['card-inner', 'priorAuthCardD3Donut'],
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
        this.gettingReimbursedService
          .getGettingReimbursedYearWiseData(...parameters)
          .subscribe(([denialData, claimsData, appealsData]) => {
            console.log(denialData, claimsData, appealsData);
          });
      }
    });
  }
}
