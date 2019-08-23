/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { NonPaymentSharedService } from './non-payment-shared.service';
import { NonPaymentService } from '../../rest/getting-reimbursed/non-payment.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class GettingReimbursedSharedService {
  public nonPaymentData: any = null;
  private tin: string;
  private lob: string;
  private timeFrame: string;
  private providerKey: number;
  private nonPaymentBy: string;
  constructor(
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private nonPaymentSharedService: NonPaymentSharedService,
    private nonPaymentService: NonPaymentService
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

  /** Function to show hovers labels as per Lob**/
  public returnHoverLabels(cardData) {
    const hoverLabels = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
        }
      }
      return hoverLabels;
    }
  }

  /** Function to show hovers colors as per Lob**/
  public returnLobColor(cardData) {
    const hoverColors = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
        }
      }
      return hoverColors;
    }
  }
  /** code starts here for shared NonPayment Data */
  /** Actually we have to used this nonPayment service in for Non-Payment cards that's why we
   * need to call the Non-Payment API in Getting Reimbursed Summary page as well
   */
  public sharedNonPaymentData() {
    /** Non Payment Service Code starts here */
    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    let tempNonPaymentData: any;
    return new Promise(resolve => {
      this.nonPaymentSharedService
        .getNonPayment()
        .then(nonPayment => {
          if (typeof nonPayment === null || typeof nonPayment === undefined) {
            tempNonPaymentData = null;
          } else {
            tempNonPaymentData = JSON.parse(JSON.stringify(nonPayment));
          }
          resolve(tempNonPaymentData);
        })
        .catch(reason => {
          console.log('NonPayment Shared Function | Getting Reimbursed | Error ', reason);
        });
    });
  }
  /** code ends here for shared NonPayment Data */

  /** The below function will return the data for the Getting Reimbursed page,
   * In the main function getGettingReimbursedData() , we will call the sharedGettingReimbursedData(parameters)
   * after calling the sharedNonPaymentData() so that we get the nonPayment data first.
   */
  public sharedGettingReimbursedYearWiseData(parameters) {
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
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      this.gettingReimbursedService
        .getGettingReimbursedYearWiseData(...parameters)
        .subscribe(([claimsData, appealsData]) => {
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (claimsData != null && claimsData.hasOwnProperty('status')) {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Total Number of Claims Submitted',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: null,
              title: 'Claims Average Turnaround Time to Payment',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Yield',
              data: null,
              timeperiod: null
            };
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Not Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
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
                title: 'Total Number of Claims Submitted*',
                data: {
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                  ],
                  centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
                  color: ['#3381FF', '#80B0FF'],
                  gdata: ['card-inner', 'totalClaimsSubmitted'],
                  sdata: {
                    sign: '',
                    data: ''
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
                title: 'Total Number of Claims Submitted',
                data: null,
                status: 404,
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
                    {
                      values: claimsData[lobData].ClaimsLobSummary[0].DosToReceived + ' Days',
                      labels: 'Date of Service to Received'
                    },
                    {
                      values: claimsData[lobData].ClaimsLobSummary[0].ReceivedToPaid + ' Days',
                      labels: 'Received to Processed'
                    }
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
                status: null,
                besideData: null,
                timeperiod: this.timeFrame
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              const paidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountPaid,
                  color: this.returnLobColor(claimsData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: null,
                status: 404,
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const notPaidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: notPaidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountDenied,
                  color: this.returnLobColor(claimsData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: null,
                status: 404,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            } // end if else for Claims Not Paid | Getting Reimbursed Non-Payment Page
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate != null &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate != null
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
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Non-Payment Rate',
                data: null,
                status: 404,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            } // end if else for Claims Non-Payment Rate | Getting Reimbursed Non-Payment Page            if (
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
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
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Yield',
                data: null,
                timeperiod: null
              };
            }
          }
          if (appealsData != null && appealsData.hasOwnProperty('status')) {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabelBottom',
              status: 404,
              title: 'Claims Appeals Submitted',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            appealsOverturned = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Appeals Overturned',
              data: null,
              timeperiod: null
            };
          } else if (appealsData.length > 0 && appealsData[0] != null) {
            if (
              appealsData[0].hasOwnProperty('LineOfBusiness') &&
              appealsData[0].LineOfBusiness !== null &&
              appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
            ) {
              const submittedData = [];
              const labelsData = [];
              const colorsData = [];
              if (appealsData[0].LineOfBusiness.hasOwnProperty('MedicareAndRetirement')) {
                let sum = 0;
                if (
                  appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
                  appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals;
                }
                if (
                  appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals') &&
                  appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals;
                }
                submittedData.push(sum);
                labelsData.push('Medicare & Retirement');
                colorsData.push('#3381FF');
              }
              if (appealsData[0].LineOfBusiness.hasOwnProperty('CommunityAndState')) {
                let sum = 0;
                if (
                  appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
                  appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals;
                }
                if (
                  appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
                  appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals;
                }
                submittedData.push(sum);
                labelsData.push('Community & State');
                colorsData.push('#80B0FF');
              }
              if (appealsData[0].LineOfBusiness.hasOwnProperty('EmployerAndIndividual')) {
                let sum = 0;
                if (
                  appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
                  appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals;
                }
                if (
                  appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
                  appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals;
                }
                submittedData.push(sum);
                labelsData.push('Employer & Individual');
                colorsData.push('#003DA1');
              }

              if (appealsData[0].LineOfBusiness.hasOwnProperty('Uncategorized')) {
                let sum = 0;
                if (
                  appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('AdminAppeals') &&
                  appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals;
                }
                if (
                  appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('ClinicalAppeals') &&
                  appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals != null
                ) {
                  sum += appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals;
                }
                submittedData.push(sum);
                labelsData.push('Uncategorized');
                colorsData.push('#00B8CC');
              }
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabelBottom',
                title: 'Claims Appeals Submitted',
                data: {
                  graphValues: submittedData,
                  centerNumber: this.common.nFormatter(
                    appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                      appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                  ),
                  centerNumberOriginal:
                    appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                    appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals,
                  color: colorsData,
                  gdata: ['card-inner', 'claimsAppealSubmitted'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: labelsData,
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                bottomData: {
                  horizontalData: [
                    {
                      values: appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                        ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                        : 0,
                      labels: 'Admin'
                    },
                    {
                      values: appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                        ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                        : 0,
                      labels: 'Clinical'
                    }
                  ]
                },
                timeperiod: this.timeFrame
              };
            } else {
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabelBottom',
                title: 'Claims Appeals Submitted',
                status: 404,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              appealsData[0].hasOwnProperty('LineOfBusiness') &&
              appealsData[0].LineOfBusiness !== null &&
              appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') != null &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') != null &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') != null
            ) {
              const submitted =
                appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
              const overturnedData = [
                appealsData[0].LineOfBusiness[lobFullData].OverTurnCount,
                submitted - appealsData[0].LineOfBusiness[lobFullData].OverTurnCount
              ];
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Appeals Overturned',
                data: {
                  graphValues: overturnedData,
                  centerNumber: appealsData[0].LineOfBusiness[lobFullData].OverTurnCount
                    ? this.common.nFormatter(appealsData[0].LineOfBusiness[lobFullData].OverTurnCount)
                    : 0,
                  centerNumberOriginal: appealsData[0].LineOfBusiness[lobFullData].OverTurnCount,
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsAppealOverturned'],
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              appealsOverturned = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Appeals Overturned',
                status: 404,
                data: null,
                timeperiod: null
              };
            }
          } else {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabelBottom',
              title: 'Claims Appeals Submitted',
              status: 404,
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            appealsOverturned = {
              category: 'app-card',
              type: 'donut',
              title: 'Claims Appeals Overturned',
              status: 404,
              data: null,
              timeperiod: null
            };
          }

          /** REMOVE LATER (ONCE PDP ISSUE SOLVED) ***/
          /*claimsPaidRate = {
            category: 'app-card',
            type: 'donut',
            title: null,
            data: null,
            timeperiod: null
          };
          claimsNotPaidRate = {
            category: 'app-card',
            type: 'donut',
            title: null,
            data: null,
            timeperiod: null
          };*/
          submissions = { id: 1, title: 'Claims Submissions*', data: [claimsSubmitted, claimsTAT] };
          payments = { id: 2, title: 'Claims Payments*', data: [claimsPaid, claimsPaidRate] };
          nonpayments = { id: 3, title: 'Claims Non-Payments*', data: [claimsNotPaid, claimsNotPaidRate] };
          appeals = { id: 4, title: 'Claims Appeals*', data: [appealsSubmitted, appealsOverturned] };
          summaryData[0] = submissions;
          summaryData[1] = payments;
          summaryData[2] = nonpayments;
          summaryData[3] = appeals;
          if (summaryData.length) {
            resolve(summaryData);
          }
        });
    });
  }
  public sharedGettingReimbursedData(parameters) {
    let appeals: object;
    let payments: object;
    let nonpayments: object;
    let submissions: object;
    let claimsSubmitted: object;
    let claimsTAT: object;
    let claimsNotPaid: object;
    let claimsNotPaidRate: object;
    let claimsPaid: object;
    let claimsPaidRate: object;
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(
        ([claimsData, appealsData]) => {
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (claimsData != null && claimsData.hasOwnProperty('status')) {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Total Number of Claims Submitted',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: null,
              title: 'Claims Average Turnaround Time to Payment',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Yield',
              data: null,
              timeperiod: null
            };
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Not Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
            ) {
              claimsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Total Number of Claims Submitted',
                toggle: this.toggle.setToggles(
                  'Total Number of Claims Submitted',
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
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted,
                  color: ['#3381FF', '#80B0FF'],
                  gdata: ['card-inner', 'totalClaimsSubmitted'],
                  sdata: {
                    sign: '',
                    data: ''
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
                title: 'Total Number of Claims Submitted',
                data: null,
                status: 404,
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
                    {
                      values: claimsData[lobData].ClaimsLobSummary[0].DosToReceived + ' Days',
                      labels: 'Date of Service to Received'
                    },
                    {
                      values: claimsData[lobData].ClaimsLobSummary[0].ReceivedToPaid + ' Days',
                      labels: 'Received to Processed'
                    }
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
                status: null,
                besideData: null,
                timeperiod: this.timeFrame
              };
            }
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              let colorcodes;
              if (lobData === 'All') {
                colorcodes = ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'];
              } else if (lobData === 'Mr') {
                colorcodes = ['#3381FF'];
              } else if (lobData === 'Cs') {
                colorcodes = ['#80B0FF'];
              } else if (lobData === 'Ei') {
                colorcodes = ['#003DA1'];
              } else {
                colorcodes = ['#00B8CC'];
              }
              const paidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (lobData !== 'All') {
                paidData.push(0);
              }
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountPaid,
                  color: this.returnLobColor(claimsData), // colorcodes,
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
              // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
              if (!paidData[0] && !paidData[1] && !paidData[2] && !paidData[3]) {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  data: {
                    graphValues: [0, 100],
                    centerNumber:
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                        ? '< $1'
                        : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                    centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountPaid,
                    color: this.returnLobColor(claimsData),
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    labels: this.returnHoverLabels(claimsData),
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  timeperiod: this.timeFrame
                };
              } // Date : 31/5/2019
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: null,
                status: 404,
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              const paidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountPaid,
                  color: this.returnLobColor(claimsData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: null,
                status: 404,
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const notPaidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: notPaidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountDenied,
                  color: this.returnLobColor(claimsData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: null,
                status: 404,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            } // end if else for Claims Not Paid | Non-Payment Page
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate != null &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate != null
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
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Non-Payment Rate',
                data: null,
                status: 404,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            } // end if else for Claims Non-Payment Rate | Getting Reimbursed Non-Payment Page            if (
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
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
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Claims Yield',
                data: null,
                timeperiod: null
              };
            }
          }

          /** REMOVE LATER (ONCE PDP ISSUE SOLVED) ***/
          /*claimsPaidRate = {
            category: 'app-card',
            type: 'donut',
            title: null,
            data: null,
            timeperiod: null
          };
          claimsNotPaidRate = {
            category: 'app-card',
            type: 'donut',
            title: null,
            data: null,
            timeperiod: null
          };*/
          submissions = { id: 1, title: 'Claims Submissions*', data: [claimsSubmitted, claimsTAT] };
          payments = { id: 2, title: 'Claims Payments*', data: [claimsPaid, claimsPaidRate] };
          nonpayments = { id: 3, title: 'Claims Non-Payments*', data: [claimsNotPaid, claimsNotPaidRate] };
          const appealsSubmitted = this.createAppealsDonuts(appealsData, lobFullData).appealsSubmitted;
          const appealsOverturned = this.createAppealsDonuts(appealsData, lobFullData).appealsOverturned;
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
        },
        err => {
          console.log('Getting Reimbursed Shared Data', err);
        }
      );
    });
  }

  public sharedPaymentsData() {
    let payments: object;
    let parameters: object;
    let claimsSubmitted: object;
    let claimsTAT: object;
    let claimsPaid: object;
    let claimsPaidRate: object;
    this.tin = this.session.filterObjValue.tax.toString().replace(/-/g, '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      if (
        this.timeFrame === 'Last 12 Months' ||
        this.timeFrame === 'Last 6 Months' ||
        this.timeFrame === 'Last 3 Months' ||
        this.timeFrame === 'Last 30 Days' ||
        this.timeFrame === 'Year to Date'
      ) {
        if (this.timeFrame === 'Last 12 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months' }];
          }
        } else if (this.timeFrame === 'Last 3 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months' }];
          }
        } else if (this.timeFrame === 'Last 30 Days') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days' }];
          }
        } else if (this.timeFrame === 'Year to Date') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [this.providerKey, { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'YTD' }];
          }
        } else if (this.timeFrame === 'Last 6 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months' }];
          }
        }
      } else {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame,
              Tin: this.tin
            }
          ];
        } else if (this.tin !== 'All') {
          parameters = [
            this.providerKey,
            { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }
          ];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame
            }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
        }
      }
      this.gettingReimbursedService.getPaymentsData(parameters).subscribe(
        claimsData => {
          const lobData = this.common.matchLobWithData(this.lob);
          if (claimsData != null && claimsData.hasOwnProperty('status')) {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Total Claims Submitted',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              title: 'Claims Average Turnaround Time to Payment',
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Paid',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            claimsPaidRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Yield',
              data: null,
              timeperiod: null
            };
          } else if (claimsData != null) {
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              let colorcodes;
              if (lobData === 'All') {
                colorcodes = ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'];
              } else if (lobData === 'Mr') {
                colorcodes = ['#3381FF'];
              } else if (lobData === 'Cs') {
                colorcodes = ['#80B0FF'];
              } else if (lobData === 'Ei') {
                colorcodes = ['#003DA1'];
              } else {
                colorcodes = ['#00B8CC'];
              }
              const paidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (lobData !== 'All') {
                paidData.push(0);
              }
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  color: this.returnLobColor(claimsData), // colorcodes,
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
              // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
              if (!paidData[0] && !paidData[1] && !paidData[2] && !paidData[3]) {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  data: {
                    graphValues: [0, 100],
                    centerNumber:
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                      this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                        ? '< $1'
                        : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                    color: this.returnLobColor(claimsData),
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    labels: this.returnHoverLabels(claimsData),
                    hover: true
                  },
                  besideData: {
                    labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  timeperiod: this.timeFrame
                };
              } // Date : 31/5/2019
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              const paidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  color: this.returnLobColor(claimsData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(claimsData),
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const notPaidData = [];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  notPaidData.push(claimsData.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
            }
            // end if else for Claims Non-Payment Rate | Getting Reimbursed Non-Payment Page            if (
            if (
              claimsData.hasOwnProperty(lobData) &&
              claimsData[lobData] != null &&
              claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
              claimsData[lobData].ClaimsLobSummary.length &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
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
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Yield',
                status: 404,
                data: null,
                timeperiod: null
              };
            }
          }

          /** REMOVE LATER (ONCE PDP ISSUE SOLVED) ***/
          // claimsPaidRate = {
          //   category: 'app-card',
          //   type: 'donut',
          //   title: null,
          //   data: null,
          //   timeperiod: null
          // };
          payments = { id: 1, title: 'Claims Payments', data: [claimsPaid, claimsPaidRate] };
          summaryData[0] = payments;

          if (summaryData.length) {
            resolve(summaryData);
          }
        },
        err => {
          console.log('Getting Reimbursed Shared Data', err);
        }
      );
    });
  }
  public getGettingReimbursedData() {
    this.tin = this.session.filterObjValue.tax.toString().replace(/-/g, '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      let parameters;
      let gettingReimbursedData: any;
      if (
        this.timeFrame === 'Last 12 Months' ||
        this.timeFrame === 'Last 6 Months' ||
        this.timeFrame === 'Last 3 Months' ||
        this.timeFrame === 'Last 30 Days' ||
        this.timeFrame === 'Year to Date'
      ) {
        if (this.timeFrame === 'Last 12 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months' }];
          }
        } else if (this.timeFrame === 'Last 3 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months' }];
          }
        } else if (this.timeFrame === 'Last 30 Days') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days' }];
          }
        } else if (this.timeFrame === 'Year to Date') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [this.providerKey, { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'YTD' }];
          }
        } else if (this.timeFrame === 'Last 6 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months' }];
          }
        }
        /** We used promise so that we get the data in synchronous manner  */
        this.sharedNonPaymentData()
          .then(nonPayment => {
            this.nonPaymentData = nonPayment;
            return this.sharedGettingReimbursedData(parameters);
          })
          .then(data => {
            gettingReimbursedData = data;
            console.log(gettingReimbursedData);
            return this.calculateSummaryTrends(parameters, gettingReimbursedData);
          })
          .then(data => {
            resolve(data);
          });
      } else {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame,
              Tin: this.tin
            }
          ];
        } else if (this.tin !== 'All') {
          parameters = [
            this.providerKey,
            { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }
          ];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame
            }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
        }
        this.sharedNonPaymentData()
          .then(nonPayment => {
            this.nonPaymentData = nonPayment;
            return this.sharedGettingReimbursedYearWiseData(parameters);
          })
          /*.then(data => {
            gettingReimbursedData = data;
            resolve(gettingReimbursedData);
          });
*/
          .then(data => {
            gettingReimbursedData = data;
            // console.log(gettingReimbursedData);
            return this.calculateSummaryTrends(parameters, gettingReimbursedData);
          })
          .then(data => {
            resolve(data);
          });
      }
    });
  }

  calculateSummaryTrends(parameters, gettingReimbursedData) {
    return new Promise((resolve, reject) => {
      let baseTimePeriod: any;
      if (this.timeFrame === 'Last 12 Months') {
        baseTimePeriod = 'PreviousLast12Months';
      }
      if (this.timeFrame === 'Last 6 Months') {
        baseTimePeriod = 'PreviousLast6Months';
      }
      if (this.timeFrame === 'Last 3 Months') {
        baseTimePeriod = 'PreviousLast3Months';
      }
      if (this.timeFrame === 'Last 30 Days') {
        baseTimePeriod = 'PreviousLast30Days';
      }
      if (this.timeFrame === 'Year to Date') {
        baseTimePeriod = 'PreviousYTD';
      }
      parameters[1].TimeFilter = baseTimePeriod;
      /* this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(([claimsData, appealsData]) => {
         const lobFullData = this.common.matchFullLobWithData(this.lob);
         const lobData = this.common.matchLobWithData(this.lob);
                  if (claimsData != null && !claimsData.hasOwnProperty('status')) {
           if (
             claimsData.hasOwnProperty(lobData) &&
             claimsData[lobData] != null &&
             claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
             claimsData[lobData].ClaimsLobSummary.length
           ) {
             if (claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')) {
               let newClaimsSubmitted = 0;
               if (gettingReimbursedData[0].data[0].data) {
                 if (gettingReimbursedData[0].data[0].data.centerNumberOriginal) {
                   newClaimsSubmitted = gettingReimbursedData[0].data[0].data.centerNumberOriginal;
                   const oldClaimsSubmitted = claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted;
                   gettingReimbursedData[0].data[0].data.sdata = this.common.trendNegativeMeansBad(
                     newClaimsSubmitted,
                     oldClaimsSubmitted
                   );
                 }
               }
             }
             if (claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
               let newClaimsPaid = 0;
               if (gettingReimbursedData[1].data[0].data) {
                 if (gettingReimbursedData[1].data[0].data.centerNumberOriginal) {
                   newClaimsPaid = gettingReimbursedData[1].data[0].data.centerNumberOriginal;
                   const oldClaimsPaid = claimsData[lobData].ClaimsLobSummary[0].AmountPaid;
                   gettingReimbursedData[1].data[0].data.sdata = this.common.trendNegativeMeansBad(
                     newClaimsPaid,
                     oldClaimsPaid
                   );
                 }
               }
             }
             if (claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountDenied')) {
               let newClaimsNotPaid = 0;
               if (gettingReimbursedData[2].data[0].data) {
                 if (gettingReimbursedData[2].data[0].data.centerNumberOriginal) {
                   newClaimsNotPaid = gettingReimbursedData[2].data[0].data.centerNumberOriginal;
                   const oldClaimsNotPaid = claimsData[lobData].ClaimsLobSummary[0].AmountDenied;
                   gettingReimbursedData[2].data[0].data.sdata = this.common.trendNegativeMeansGood(
                     newClaimsNotPaid,
                     oldClaimsNotPaid
                   );
                 }
               }
             }
           }
         }
         if (appealsData != null && !appealsData.hasOwnProperty('status') && appealsData[0] != null) {
           if (
             appealsData[0].hasOwnProperty('LineOfBusiness') &&
             appealsData[0].LineOfBusiness !== null &&
             appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
             appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
             appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
           ) {
             let newClaimsAppealsSubmitted = 0;
             if (gettingReimbursedData[3].data[0].data) {
               if (gettingReimbursedData[3].data[0].data.centerNumberOriginal) {
                 newClaimsAppealsSubmitted = gettingReimbursedData[3].data[0].data.centerNumberOriginal;
                 const oldClaimsAppealsSubmitted =
                   appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                   appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
                 gettingReimbursedData[3].data[0].data.sdata = this.common.trendNegativeMeansGood(
                   newClaimsAppealsSubmitted,
                   oldClaimsAppealsSubmitted
                 );
               }
             }
           }
         }
                  resolve(gettingReimbursedData);
       });*/
      resolve(gettingReimbursedData);
    });
  }

  public getTins() {
    return new Promise((resolve, reject) => {
      this.providerKey = this.session.providerKeyData();
      this.gettingReimbursedService.getTins(this.providerKey).subscribe(tins => {
        const providerTins = tins;
        resolve(providerTins);
      });
    });
  }

  /* function to get Payment Integrity Card Data - Ranjith kumar Ankam */
  public getPaymentIntegrityData() {
    return new Promise((resolve, reject) => {
      this.timeFrame = this.session.timeFrame;
      this.timeFrame = 'Last 6 Months';

      this.providerKey = this.session.providerKeyData();

      const parameters = {
        providerkey: this.providerKey,
        timeperiod: ''
      };

      /*if (this.timeFrame === 'Last 12 Months') {
        parameters.timeperiod = 'Last12Months';
      } else if (this.timeFrame === 'Last 6 Months') {
        parameters.timeperiod = 'last6months';
      }*/

      this.gettingReimbursedService.getPaymentIntegrityData(parameters).subscribe(
        r => {
          if ((r !== null && typeof r !== 'string') || r !== 'OK') {
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
                labels: ['Pre-Payment Medical Records Requested', 'Claims Submitted']
              }
            };
            resolve(output);
          } else if (typeof r === 'string' || r === 'OK') {
            const temp = {
              category: 'large-card',
              type: 'donutWithLabelBottom',
              status: 500,
              title: 'Claims Payment Integrity',
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            resolve(temp);
          } else {
            resolve(null);
          }
        },
        error => {
          console.log('error Payment Integrity', error);
        }
      );
    });
  }
  getParmaeterCategories() {
    let parameters = [];
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    if (
      this.timeFrame === 'Last 12 Months' ||
      this.timeFrame === 'Last 6 Months' ||
      this.timeFrame === 'Last 3 Months' ||
      this.timeFrame === 'Last 30 Days' ||
      this.timeFrame === 'Year to Date'
    ) {
      if (this.timeFrame === 'Last 12 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          parameters = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'Last12Months' }];
        }
      } else if (this.timeFrame === 'Year to Date') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          parameters = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          parameters = [this.providerKey, { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'YTD' }];
        }
      } else if (this.timeFrame === 'Last 6 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          parameters = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'Last6Months' }];
        }
      } else if (this.timeFrame === 'Last 3 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          parameters = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'Last3Months' }];
        }
      } else if (this.timeFrame === 'Last 30 Days') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          parameters = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'Last30Days' }];
        }
      }
    } else {
      const lobData = this.common.matchLobWithData(this.lob);
      if (this.tin !== 'All' && this.lob !== 'All') {
        parameters = [
          this.providerKey,
          {
            Lob: this.common.matchLobWithCapsData(this.lob),
            TimeFilter: 'CalendarYear',
            TimeFilterText: this.timeFrame,
            Tin: this.tin
          }
        ];
      } else if (this.tin !== 'All') {
        parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }];
      } else if (this.lob !== 'All') {
        parameters = [
          this.providerKey,
          {
            Lob: this.common.matchLobWithCapsData(this.lob),
            TimeFilter: 'CalendarYear',
            TimeFilterText: this.timeFrame
          }
        ];
      } else {
        parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
      }
    } // End If else structure
    return parameters;
  } // end getParmaeterCategories() function for Top Reasons Categories

  getclaimsPaidData() {
    this.tin = this.session.filterObjValue.tax.toString().replace(/-/g, '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    // 'Last 6 Months'; // this.session.timeFrame;
    this.providerKey = this.session.providerKeyData();
    let parameters = [];
    parameters = this.getParmaeterCategories();
    // let paidArray:  Array<Object> = [];
    return new Promise((resolve, reject) => {
      let paidBreakdown = [];
      let paidArray: Array<Object> = [];
      this.gettingReimbursedService.getPaymentData(...parameters).subscribe(paymentDatafetch => {
        try {
          const paymentData = JSON.parse(JSON.stringify(paymentDatafetch));
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (paymentData !== null) {
            paidBreakdown = [
              paymentData[lobData].ClaimsLobSummary[0].AmountBilled,
              paymentData[lobData].ClaimsLobSummary[0].AmountActualAllowed +
                paymentData[lobData].ClaimsLobSummary[0].PatientResponsibleAmount,
              paymentData[lobData].ClaimsLobSummary[0].AmountDenied,
              paymentData[lobData].ClaimsLobSummary[0].AmountUHCPaid
            ];
          }
          paidArray = [paidBreakdown];
          resolve(paidArray);
        } catch (Error) {
          const temp = {
            category: 'large-card',
            type: 'donut',
            status: 404,
            title: 'Claims Paid Breakdown',
            data: null,
            timeperiod: null
          };
          resolve(temp);
        }
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

  public createAppealsDonuts(appealsData, lobFullData) {
    let appealsSubmitted = {};
    let appealsOverturned = {};
    if (appealsData != null && appealsData.hasOwnProperty('status')) {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithLabelBottom',
        status: 404,
        title: 'Claims Appeals Submitted',
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
      appealsOverturned = {
        category: 'app-card',
        type: 'donut',
        status: 404,
        title: 'Claims Appeals Overturned',
        data: null,
        timeperiod: null
      };
    } else if (appealsData.length > 0 && appealsData[0] != null) {
      if (
        appealsData[0].hasOwnProperty('LineOfBusiness') &&
        appealsData[0].LineOfBusiness !== null &&
        appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
      ) {
        const submittedData = [];
        const labelsData = [];
        const colorsData = [];
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
          appealsData[0].LineOfBusiness.MedicareAndRetirement != null
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Medicare & Retirement');
          colorsData.push('#3381FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('CommunityAndState') &&
          appealsData[0].LineOfBusiness.CommunityAndState != null
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Community & State');
          colorsData.push('#80B0FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
          appealsData[0].LineOfBusiness.EmployerAndIndividual != null
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Employer & Individual');
          colorsData.push('#003DA1');
        }

        if (appealsData[0].LineOfBusiness.hasOwnProperty('Uncategorized')) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Uncategorized');
          colorsData.push('#00B8CC');
        }
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithLabelBottom',
          title: 'Claims Appeals Submitted',
          data: {
            graphValues: submittedData,
            centerNumber: this.common.nFormatter(
              appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
            ),
            centerNumberOriginal:
              appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
              appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals,
            color: colorsData,
            gdata: ['card-inner', 'claimsAppealSubmitted'],
            sdata: {
              sign: '',
              data: ''
            },
            labels: labelsData,
            hover: true
          },
          besideData: {
            labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          bottomData: {
            horizontalData: [
              {
                values: appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                  ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                  : 0,
                labels: 'Admin'
              },
              {
                values: appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                  ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                  : 0,
                labels: 'Clinical'
              }
            ]
          },
          timeperiod: this.timeFrame
        };
      } else {
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithLabelBottom',
          title: 'Claims Appeals Submitted',
          status: 404,
          data: null,
          besideData: null,
          bottomData: null,
          timeperiod: null
        };
      }
      if (
        appealsData[0].hasOwnProperty('LineOfBusiness') &&
        appealsData[0].LineOfBusiness !== null &&
        appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].OverTurnCount != null
      ) {
        const sumOverturned = appealsData[0].LineOfBusiness[lobFullData].OverTurnCount;

        let sum = 0;
        if (appealsData[0].LineOfBusiness[lobFullData].AdminAppeals != null) {
          sum += appealsData[0].LineOfBusiness[lobFullData].AdminAppeals;
        }
        if (appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals != null) {
          sum += appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
        }
        const submitted = sum;
        const overturnedData = [sumOverturned, submitted - sumOverturned];
        appealsOverturned = {
          category: 'app-card',
          type: 'donut',
          title: 'Claims Appeals Overturned',
          data: {
            graphValues: overturnedData,
            centerNumber: this.common.nFormatter(sumOverturned),
            centerNumberOriginal: sumOverturned,
            color: ['#3381FF', '#D7DCE1'],
            gdata: ['card-inner', 'claimsAppealOverturned'],
            sdata: null
          },
          timeperiod: this.timeFrame
        };
      } else {
        appealsOverturned = {
          category: 'app-card',
          type: 'donut',
          title: 'Claims Appeals Overturned',
          status: 404,
          data: null,
          timeperiod: null
        };
      }
    } else {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithLabelBottom',
        title: 'Claims Appeals Submitted',
        status: 404,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
      appealsOverturned = {
        category: 'app-card',
        type: 'donut',
        title: 'Claims Appeals Overturned',
        status: 404,
        data: null,
        timeperiod: null
      };
    }
    return { appealsSubmitted: appealsSubmitted, appealsOverturned: appealsOverturned };
  }
}
