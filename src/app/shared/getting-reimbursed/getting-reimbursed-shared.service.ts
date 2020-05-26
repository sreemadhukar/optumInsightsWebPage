/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { NonPaymentSharedService } from './non-payments/non-payment-shared.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { GettingReimbursedPayload } from './payload.class';
import * as _ from 'lodash';
import { PaymentsSharedService } from './payments/payments-shared.service';
import { lobName } from '../../modals/lob-name';

@Injectable({
  providedIn: 'root'
})
export class GettingReimbursedSharedService {
  public nonPaymentData: any = null;
  public PaymentData: any = null;
  public ClaimsSubmittedData: any = null;
  public ClaimsTATdata: any = null;
  public gettingReimbursedTabName;
  private timeFrame: string;
  private providerKey: number;

  constructor(
    private MetricidService: GlossaryMetricidService,
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private nonPaymentSharedService: NonPaymentSharedService,
    private paymentSharedService: PaymentsSharedService
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

  /** code starts here for shared NonPayment Data */
  /** Actually we have to used this nonPayment service in for Non-Payment cards that's why we
   * need to call the Non-Payment API in Getting Reimbursed Summary page as well
   */
  public sharedNonPaymentData(param) {
    /** Non Payment Service Code starts here */
    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    let tempNonPaymentData: any;
    return new Promise(resolve => {
      this.nonPaymentSharedService
        .getNonPayment(param)
        .then(nonPayment => {
          if (typeof nonPayment === null || typeof nonPayment === undefined) {
            tempNonPaymentData = null;
          } else {
            tempNonPaymentData = nonPayment;
          }
          resolve(tempNonPaymentData);
        })
        .catch(reason => {
          console.log('NonPayment Shared Function | Getting Reimbursed | Error ', reason);
        });
    });
  }
  public sharedPaymentData(param) {
    /** Non Payment Service Code starts here */
    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    let tempPaymentData: any;
    return new Promise(resolve => {
      const toggleData = { isSummary: true, page: 'Claims Payments', menu: 'Getting Reimbursed' };
      this.paymentSharedService
        .getPaymentsData(param, toggleData)
        .then(payment => {
          if (typeof payment === null || typeof payment === undefined) {
            tempPaymentData = null;
          } else {
            tempPaymentData = payment;
          }
          resolve(tempPaymentData);
        })
        .catch(reason => {
          console.log('Payment Shared Function | Getting Reimbursed | Error ', reason);
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

    let appealsSubmittedClosedtitle = 'Claims Appeals Submitted';
    const appealTypeForTitle = parameters[1].appealsProcessing;
    if (appealTypeForTitle === 'Closed Date') {
      appealsSubmittedClosedtitle = 'Claims Appeals Closed';
    }

    return new Promise(resolve => {
      this.gettingReimbursedService
        .getGettingReimbursedYearWiseData(...parameters)
        .subscribe(([claimsData, appealsData]) => {
          const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
          const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
          if (claimsData != null && claimsData.hasOwnProperty('status')) {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Total Number of Claims Processed',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: 404,
              title: 'Average Claim Processing Days',
              MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
              data: null,
              besideData: null,
              timeperiod: null
            };
            claimsPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Paid',
              MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
              toggle: true,
              MetricID: this.MetricidService.MetricIDs.ClaimsYield,
              data: null,
              timeperiod: null
            };
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Claims Not Paid',
              MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
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
              MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
              data: null,
              toggle: true,
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
                title: 'Total Number of Claims Processed*',
                MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
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
                  color: ['#3381FF', '#80B0FF'],
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                  ]
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsSubmitted = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Total Number of Claims Processed',
                MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
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
                title: 'Average Claim Processing Days',
                MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
                toggle: true,
                data: {
                  centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsAvgTat + ' days',
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
                      values: claimsData[lobData].ClaimsLobSummary[0].AvgDosToReceived + ' Days',
                      labels: 'Date of Service to Received'
                    },
                    {
                      values: claimsData[lobData].ClaimsLobSummary[0].AvgReceivedToPaid + ' Days',
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
                title: 'Average Claim Processing Days',
                MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
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
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
                data: {
                  graphValues: paidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountPaid),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountPaid,
                  color: this.common.returnLobColor(claimsData, lobData),
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.common.returnHoverLabels(claimsData, lobData),
                  hover: true
                },
                besideData: {
                  labels: [
                    lobName.mAndRMedicare,
                    lobName.cAndSMedicaid,
                    lobName.eAndICommerCial,
                    lobName.unCategorized
                  ],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  graphValues: paidData
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
                data: {
                  graphValues: notPaidData,
                  centerNumber:
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].AmountDenied),
                  centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].AmountDenied,
                  color: this.common.returnLobColor(claimsData, lobData),
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.common.returnHoverLabels(claimsData, lobData),
                  hover: true
                },
                besideData: {
                  labels: [
                    lobName.mAndRMedicare,
                    lobName.cAndSMedicaid,
                    lobName.eAndICommerCial,
                    lobName.unCategorized
                  ],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  graphValues: notPaidData
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
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
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                toggle: true,
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
                MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentRate,
                data: null,
                toggle: true,
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() !== 0
            ) {
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims-Yield',
                MetricID: this.MetricidService.MetricIDs.ClaimsYield,
                toggle: true,
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
                toogle: true,
                MetricID: this.MetricidService.MetricIDs.ClaimsYield,
                data: null,
                timeperiod: null
              };
            }
          }
          if (appealsData != null && appealsData.hasOwnProperty('status')) {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithoutLabelBottom',
              status: 404,
              title: appealsSubmittedClosedtitle,
              MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
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
                if (appealTypeForTitle === 'Closed Date') {
                  sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.TotalClosedCount;
                }
                submittedData.push(sum);
                labelsData.push(lobName.mAndRMedicare);
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
                if (appealTypeForTitle === 'Closed Date') {
                  sum += appealsData[0].LineOfBusiness.CommunityAndState.TotalClosedCount;
                }
                submittedData.push(sum);
                labelsData.push(lobName.cAndSMedicaid);
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
                if (appealTypeForTitle === 'Closed Date') {
                  sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.TotalClosedCount;
                }
                submittedData.push(sum);
                labelsData.push(lobName.eAndICommerCial);
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
                if (appealTypeForTitle === 'Closed Date') {
                  sum += appealsData[0].LineOfBusiness.Uncategorized.TotalClosedCount;
                }
                submittedData.push(sum);
                labelsData.push(lobName.unCategorized);
                colorsData.push('#00B8CC');
              }
              appealsSubmitted = {
                category: 'app-card',
                type: 'donutWithoutLabelBottom',
                title: appealsSubmittedClosedtitle,
                MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
                  labels: [
                    lobName.mAndRMedicare,
                    lobName.cAndSMedicaid,
                    lobName.eAndICommerCial,
                    lobName.unCategorized
                  ],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  graphValues: submittedData
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
                type: 'donutWithoutLabelBottom',
                title: appealsSubmittedClosedtitle,
                MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
                MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
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
                MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
                status: 404,
                data: null,
                timeperiod: null
              };
            }
          } else {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithoutLabelBottom',
              title: appealsSubmittedClosedtitle,
              MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
              status: 404,
              data: null,
              timeperiod: null
            };
          }

          submissions = {
            id: 1,
            title: 'Claims Processed',
            MetricID: this.MetricidService.MetricIDs.ClaimsSubmissions,
            data: [claimsSubmitted, claimsTAT]
          };
          payments = {
            id: 2,
            title: 'Claims Payments',
            MetricID: this.MetricidService.MetricIDs.ClaimsPayments,
            data: [claimsPaid, claimsPaidRate]
          };
          nonpayments = {
            id: 3,
            title: 'Claims Non-Payments',
            MetricID: this.MetricidService.MetricIDs.ClaimsNonPayments,
            data: [claimsNotPaid, claimsNotPaidRate]
          };
          appeals = {
            id: 4,
            title: 'Claims Appeals',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppeals,
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
    });
  }
  public sharedGettingReimbursedData(parameters) {
    let appeals: object;
    let appealsFilterSelected = 'DOR';
    if (parameters[1].appealsProcessing === 'Received Date') {
      appealsFilterSelected = 'DOR';
    } else if (parameters[1].appealsProcessing === 'Closed Date') {
      appealsFilterSelected = 'DOC';
    }
    return new Promise(resolve => {
      this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(
        ([{}, appealsData]) => {
          const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';

          const appealsSubmitted = this.createAppealsDonuts(appealsData, lobFullData, appealsFilterSelected)
            .appealsSubmitted;
          const appealsOverturned = this.createAppealsDonuts(appealsData, lobFullData, appealsFilterSelected)
            .appealsOverturned;
          appeals = {
            id: 4,
            title: 'Claims Appeals',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppeals,
            data: [appealsSubmitted, appealsOverturned]
          };

          resolve(appeals);
        },
        err => {
          console.log('Getting Reimbursed Shared Data', err);
        }
      );
    });
  }
  public getGettingReimbursedData(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.providerKey = this.session.providerKeyData();
    const summaryData: Array<object> = [];
    let payments: object;
    let nonpayments: object;
    let submissions: object;
    return new Promise(resolve => {
      let parameters;
      parameters = [this.providerKey, new GettingReimbursedPayload(param)];

      /** We used promise so that we get the data in synchronous manner  */

      this.sharedNonPaymentData(param)
        .then(nonPayment => {
          this.nonPaymentData = nonPayment;
          return this.sharedPaymentData(parameters);
        })
        .then(payment => {
          this.PaymentData = payment;
          return this.claimSubmissionsData(parameters, payment[1]);
        })
        .then(claims => {
          this.ClaimsSubmittedData = claims;
          return this.claimsTATData(parameters, this.PaymentData[1]);
        })
        .then(tatData => {
          this.ClaimsTATdata = tatData;
          return this.sharedGettingReimbursedData(parameters);
        })
        .then(appeals => {
          submissions = {
            id: 1,
            title: 'Claims Processed',
            MetricID: this.MetricidService.MetricIDs.ClaimsSubmissions,
            data: [this.ClaimsSubmittedData, this.ClaimsTATdata]
          };
          payments = {
            id: 2,
            title: 'Claims Payments',
            MetricID: this.MetricidService.MetricIDs.ClaimsPayments,
            data: this.PaymentData[0]
          };
          nonpayments = {
            id: 3,
            title: 'Claims Non-Payments',
            MetricID: this.MetricidService.MetricIDs.ClaimsNonPayments,
            data: this.nonPaymentData
          };

          summaryData[0] = submissions;
          summaryData[1] = payments;
          summaryData[2] = nonpayments;
          summaryData[3] = appeals;

          resolve(summaryData);
        });
    });
  }

  claimsTATData(parameters, claimsData) {
    let claimsTAT: object;
    return new Promise(resolve => {
      const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
      const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
      if (parameters[1]['ClaimsBy'] === 'DOS') {
        if (!claimsData || !claimsData.hasOwnProperty(lobData)) {
          claimsTAT = {
            category: 'app-card',
            type: 'rotateWithLabel',
            status: 404,
            title: 'Average Claim Processing Days',
            MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
            data: null,
            besideData: null,
            timeperiod: null
          };
        } else if (claimsData != null) {
          if (
            claimsData.hasOwnProperty(lobData) &&
            claimsData[lobData] != null &&
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat') &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('DosToReceived') &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ReceivedToPaid')
          ) {
            const startDate = (claimsData || {}).Startdate;
            const endDate = (claimsData || {}).Enddate;
            const timePeriodCalls: String = this.common.dateFormat(startDate) + ' - ' + this.common.dateFormat(endDate);

            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              title: 'Average Claim Processing Days',
              MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
              // toggle: true,
              data: {
                centerNumber: claimsData[lobData].ClaimsLobSummary[0].ClaimsAvgTat + ' days',
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
                    values: claimsData[lobData].ClaimsLobSummary[0].AvgDosToReceived + ' Days',
                    labels: 'Date of Service to Received'
                  },
                  {
                    values: claimsData[lobData].ClaimsLobSummary[0].AvgReceivedToPaid + ' Days',
                    labels: 'Received to Processed'
                  }
                ]
              },
              timeperiod: timePeriodCalls
            };
          } else {
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: 404,
              title: 'Average Claim Processing Days',
              MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
              data: null,
              besideData: null,
              timeperiod: null
            };
          }
        }

        resolve(claimsTAT);
      } else {
        this.gettingReimbursedService.getTatDataforDOP(parameters).subscribe(claimsdata => {
          if (!claimsdata || !claimsdata.hasOwnProperty('LineOfBusiness')) {
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: 404,
              title: 'Average Claim Processing Days',
              MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
              data: null,
              besideData: null,
              timeperiod: null
            };
          } else if (claimsdata != null) {
            if (
              claimsdata.LineOfBusiness.hasOwnProperty(lobFullData) &&
              claimsdata.LineOfBusiness[lobFullData] != null &&
              claimsdata.LineOfBusiness[lobFullData].hasOwnProperty('TatMetrics') &&
              claimsdata.LineOfBusiness[lobFullData].TatMetrics.hasOwnProperty('ClaimsAvgTat') &&
              claimsdata.LineOfBusiness[lobFullData].TatMetrics.hasOwnProperty('AvgDosToReceived') &&
              claimsdata.LineOfBusiness[lobFullData].TatMetrics.hasOwnProperty('AvgReceivedToPaid')
            ) {
              const startDate = (claimsdata || {}).StartDate;
              const endDate = (claimsdata || {}).EndDate;
              const timePeriodCalls: String =
                this.common.dateFormat(startDate) + '&ndash;' + this.common.dateFormat(endDate);

              claimsTAT = {
                category: 'app-card',
                type: 'rotateWithLabel',
                title: 'Average Claim Processing Days',
                MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,

                data: {
                  centerNumber: claimsdata.LineOfBusiness[lobFullData].TatMetrics.ClaimsAvgTat + ' days',
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
                      values: claimsdata.LineOfBusiness[lobFullData].TatMetrics.AvgDosToReceived + ' Days',
                      labels: 'Date of Service to Received'
                    },
                    {
                      values: claimsdata.LineOfBusiness[lobFullData].TatMetrics.AvgReceivedToPaid + ' Days',
                      labels: 'Received to Processed'
                    }
                  ]
                },
                timeperiod: timePeriodCalls
              };
            } else {
              claimsTAT = {
                category: 'app-card',
                type: 'rotateWithLabel',
                status: 404,
                title: 'Average Claim Processing Days',
                MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
                data: null,
                besideData: null,
                timeperiod: null
              };
            }
          } else {
            claimsTAT = {
              category: 'app-card',
              type: 'rotateWithLabel',
              status: 404,
              title: 'Average Claim Processing Days',
              MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
              data: null,
              besideData: null,
              timeperiod: null
            };
          }
          resolve(claimsTAT);
        });
      }
    });
  }

  claimSubmissionsData(parameters, claimsData) {
    let claimsSubmitted: object;
    let timePeriodData: String;
    return new Promise(resolve => {
      const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
      const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';

      if (parameters[1]['ClaimsBy'] === 'DOS') {
        if (claimsData != null) {
          if (
            claimsData.hasOwnProperty(lobData) &&
            claimsData[lobData] != null &&
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
            claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
          ) {
            if (claimsData.hasOwnProperty('Startdate') && claimsData.hasOwnProperty('Enddate')) {
              timePeriodData =
                this.common.dateFormat(claimsData.Startdate) + '&ndash;' + this.common.dateFormat(claimsData.Enddate);
            }
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Total Number of Claims Processed',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: {
                graphValues: [
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                ],

                centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted,

                labels: ['Paid', 'Not Paid'],
                hover: true,

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
                color: ['#3381FF', '#80B0FF'],
                graphValues: [
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                ]
              },
              timeperiod: timePeriodData
            };

            resolve(claimsSubmitted);
          } else {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Total Number of Claims Processed',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: null,
              status: 404,
              besideData: null,
              timeperiod: null
            };

            resolve(claimsSubmitted);
          }
        } else {
          claimsSubmitted = {
            category: 'app-card',
            type: 'donutWithLabel',
            title: 'Total Number of Claims Processed',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            status: 404,
            besideData: null,
            timeperiod: null
          };

          resolve(claimsSubmitted);
        }
      } else {
        if (!claimsData || !claimsData.hasOwnProperty('LineOfBusiness')) {
          claimsSubmitted = {
            category: 'app-card',
            type: 'donutWithLabel',
            status: 404,
            title: 'Total Number of Claims Processed',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            besideData: null,
            timeperiod: null
          };
          resolve(claimsSubmitted);
        } else if (claimsData != null) {
          if (
            claimsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
            claimsData.LineOfBusiness[lobFullData] != null &&
            claimsData.LineOfBusiness[lobFullData].hasOwnProperty('ClaimFinancialMetrics') &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('ApprovedCount') &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('DeniedCount')
          ) {
            if (claimsData.hasOwnProperty('StartDate') && claimsData.hasOwnProperty('EndDate')) {
              timePeriodData =
                this.common.dateFormat(claimsData.StartDate) + '&ndash;' + this.common.dateFormat(claimsData.EndDate);
            }
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Total Number of Claims Processed',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              toggle: this.toggle.setToggles(
                'Total Number of Claims Processed',
                'Claims Processed',
                'Getting Reimbursed',
                true
              ),
              data: {
                graphValues: [
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.ApprovedCount,
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.DeniedCount
                ],
                centerNumber: this.common.nFormatter(
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.ApprovedCount +
                    claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.DeniedCount
                ),
                centerNumberOriginal:
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.ApprovedCount +
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.DeniedCount,
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
                color: ['#3381FF', '#80B0FF'],
                graphValues: [
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.ApprovedCount,
                  claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.DeniedCount
                ]
              },
              timeperiod: timePeriodData
            };
          } else {
            claimsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Total Number of Claims Processed',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: null,
              status: 404,
              besideData: null,
              timeperiod: null
            };
          }

          resolve(claimsSubmitted);
        } else {
          claimsSubmitted = {
            category: 'app-card',
            type: 'donutWithLabel',
            title: 'Total Number of Claims Processed',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            status: 404,
            besideData: null,
            timeperiod: null
          };
          resolve(claimsSubmitted);
        }
      }
    });
  }
  calculateSummaryTrends(parameters, gettingReimbursedData) {
    return new Promise(resolve => {
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
      // this.gettingReimbursedService.getGettingReimbursedData(...parameters).subscribe(([claimsData]) => {
      // const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
      //  const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
      resolve(gettingReimbursedData);
    });
    // resolve(gettingReimbursedData);
    //  });
  }
  public getTins() {
    return new Promise(resolve => {
      this.providerKey = this.session.providerKeyData();
      this.gettingReimbursedService.getTins(this.providerKey).subscribe(tins => {
        const providerTins = tins;
        resolve(providerTins);
      });
    });
  }

  /* function to get Payment Integrity Card Data - Ranjith kumar Ankam */
  public getPaymentIntegrityData() {
    return new Promise(resolve => {
      this.timeFrame = 'Last 6 Months';

      this.providerKey = this.session.providerKeyData();

      const parameters = {
        providerkey: this.providerKey,
        timeperiod: ''
      };

      this.gettingReimbursedService.getPaymentIntegrityData(parameters).subscribe(
        r => {
          if (((r !== null && typeof r !== 'string') || r !== 'OK') && !r.status) {
            const paymentIntegrityData = r;
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
            const endDate = new Date(paymentIntegrityData.EndDate);
            output.timeperiod =
              this.common.dateFormat(paymentIntegrityData.StartDate + '-01') +
              '&ndash;' +
              this.common.dateFormat(
                paymentIntegrityData.EndDate + '-' + this.daysInMonth(endDate.getMonth() + 1, endDate.getFullYear())
              );
            let sData: any = {};
            if (result.RecordsRequestedVariance > 0) {
              sData = { sign: 'down', data: output.RecordsRequestedVariance + ' †' };
            } else {
              sData = { sign: 'up', data: output.RecordsRequestedVariance + ' †' };
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
              MetricID: this.MetricidService.MetricIDs.ClaimsPaymentIntegrity,
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
            resolve(temp);
          } else if (r.status) {
            if (r.status === 404) {
              r.status = 501;
            }
            const temp = {
              category: 'large-card',
              type: 'donutWithLabelBottom',
              status: r.status,
              title: 'Claims Payment Integrity',
              MetricID: this.MetricidService.MetricIDs.ClaimsPaymentIntegrity,
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

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  public sentenceCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public getMonthname(dt) {
    const month = dt.substr(dt.indexOf('-') + 1);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[Number(month) - 1];
  }

  public getFullyear(dt) {
    const d = new Date(dt);
    return d.getFullYear();
  }

  public createAppealsDonuts(appealsData, lobFullData, appealsFilterSelected) {
    let appealsSubmitted = {};
    let appealsOverturned = {};
    let appealsSubmittedTitle = '';

    if (appealsFilterSelected === 'DOR') {
      appealsSubmittedTitle = 'Claims Appeals Submitted';
    } else if (appealsFilterSelected === 'DOC') {
      appealsSubmittedTitle = 'Claims Appeals Closed';
    }
    if (appealsData && appealsData.hasOwnProperty('status')) {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithoutLabelBottom',
        status: 404,
        title: appealsSubmittedTitle,
        MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
        MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
        data: null,
        timeperiod: null
      };
    } else if (appealsData && appealsData[0] != null) {
      let appealsSubmittedCenterNum = 0;

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
          appealsData[0].LineOfBusiness.MedicareAndRetirement != null &&
          (lobFullData === 'ALL' || lobFullData === 'MedicareAndRetirement')
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
          if (appealsFilterSelected === 'DOC') {
            sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.TotalClosedCount;
          }
          submittedData.push(sum);
          labelsData.push(lobName.mAndRMedicare);
          colorsData.push('#3381FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('CommunityAndState') &&
          appealsData[0].LineOfBusiness.CommunityAndState != null &&
          (lobFullData === 'ALL' || lobFullData === 'CommunityAndState')
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
          if (appealsFilterSelected === 'DOC') {
            sum += appealsData[0].LineOfBusiness.CommunityAndState.TotalClosedCount;
          }
          submittedData.push(sum);
          labelsData.push(lobName.cAndSMedicaid);
          colorsData.push('#80B0FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
          appealsData[0].LineOfBusiness.EmployerAndIndividual != null &&
          (lobFullData === 'ALL' || lobFullData === 'EmployerAndIndividual')
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
          if (appealsFilterSelected === 'DOC') {
            sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.TotalClosedCount;
          }
          submittedData.push(sum);
          labelsData.push(lobName.eAndICommerCial);
          colorsData.push('#003DA1');
        }

        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('Uncategorized') &&
          appealsData[0].LineOfBusiness.Uncategorized != null &&
          (lobFullData === 'ALL' || lobFullData === 'Uncategorized')
        ) {
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
          labelsData.push(lobName.unCategorized);
          colorsData.push('#00B8CC');
        }
        if (lobFullData !== 'ALL') {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.ALL.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.ALL.AdminAppeals != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness[lobFullData].AdminAppeals != null
          ) {
            sum +=
              appealsData[0].LineOfBusiness.ALL.AdminAppeals - appealsData[0].LineOfBusiness[lobFullData].AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.ALL.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.ALL.ClinicalAppeals != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals != null
          ) {
            sum +=
              appealsData[0].LineOfBusiness.ALL.ClinicalAppeals -
              appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
          }
          if (appealsFilterSelected === 'DOC') {
            sum += appealsData[0].LineOfBusiness[lobFullData].TotalClosedCount;
          }
          submittedData.push(sum);
          labelsData.push('Other Lines of Business');
          colorsData.push('#D7DCE1');
        }
        const sideData = [];
        if (lobFullData !== 'ALL') {
          const labelsDataNew = labelsData.slice(0, -1);
          const colorsDataNew = colorsData.slice(0, -1);
          sideData[0] = labelsDataNew;
          sideData[1] = colorsDataNew;
        } else {
          sideData[0] = labelsData;
          sideData[1] = colorsData;
        }
        if (appealsFilterSelected === 'DOR') {
          appealsSubmittedCenterNum = this.common.nFormatter(
            appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
              appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
          );
        } else if (appealsFilterSelected === 'DOC') {
          appealsSubmittedCenterNum = this.common.nFormatter(
            appealsData[0].LineOfBusiness[lobFullData].TotalClosedCount
          );
        }
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithoutLabelBottom',
          title: appealsSubmittedTitle,
          MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
          data: {
            graphValues: submittedData,
            centerNumber: appealsSubmittedCenterNum,
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
            labels: sideData[0],
            color: sideData[1],
            graphValues: submittedData
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
          timeperiod:
            this.common.dateFormat(appealsData[0].StartDate) +
            '&ndash;' +
            this.common.dateFormat(appealsData[0].EndDate)
        };
      } else {
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithoutLabelBottom',
          title: appealsSubmittedTitle,
          MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
          MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
          data: {
            graphValues: overturnedData,
            centerNumber: this.common.nFormatter(sumOverturned),
            centerNumberOriginal: sumOverturned,
            color: ['#3381FF', '#D7DCE1'],
            gdata: ['card-inner', 'claimsAppealOverturned'],
            sdata: null
          },
          timeperiod:
            this.common.dateFormat(appealsData[0].StartDate) +
            '&ndash;' +
            this.common.dateFormat(appealsData[0].EndDate)
        };
      } else {
        appealsOverturned = {
          category: 'app-card',
          type: 'donut',
          title: 'Claims Appeals Overturned',
          MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
          status: 404,
          data: null,
          timeperiod: null
        };
      }
    } else {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithoutLabelBottom',
        title: appealsSubmittedTitle,
        MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
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
        MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
        status: 404,
        data: null,
        timeperiod: null
      };
    }
    return { appealsSubmitted: appealsSubmitted, appealsOverturned: appealsOverturned };
  }
}
