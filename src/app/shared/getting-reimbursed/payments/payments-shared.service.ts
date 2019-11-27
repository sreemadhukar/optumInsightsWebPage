/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../../components/getting-reimbursed-page/getting-reimbursed.module';
import { GettingReimbursedService } from '../../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../../common-utils.service';
import { SessionService } from '../../session.service';
import { GettingReimbursedPayload } from '../payload.class';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class PaymentsSharedService {
  public nonPaymentData: any = null;
  private tin: string;
  private lob: string;
  private timeFrame: string;
  private providerKey: number;
  private nonPaymentBy: string;
  constructor(
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService
  ) {}

  public sharedPaymentsData(param) {
    const parameters = this.getParameterCategories(param);
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    // let claimsSubmitted: object;
    // let claimsTAT: object;
    // let claimsPaid: object;
    // let claimsPaidRate: object;
    this.providerKey = this.session.providerKeyData();
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      this.getPaymentsData(parameters)
        .then(paydata => {
          return this.calculateTrends(parameters, paydata);
        })
        .then(data => {
          const payments = { id: 1, title: 'Claims Payments', data: data };
          summaryData[0] = payments;
          resolve(summaryData);
        });
    });
  }

  calculateTrends(parameters, paymentsData) {
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

      this.gettingReimbursedService.getPaymentsData(parameters).subscribe(claimsData => {
        const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
        if (claimsData != null && !claimsData.hasOwnProperty('status')) {
          if (
            claimsData.hasOwnProperty(lobData) &&
            claimsData[lobData] != null &&
            claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
            claimsData[lobData].ClaimsLobSummary.length
          ) {
            /** Commenting following lines of code to remove trends from  Payments page **/
            /* if (claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
              let newClaimsPaid = 0;
              if (paymentsData[0].data) {
                if (paymentsData[0].data.centerNumberOriginal) {
                  newClaimsPaid = paymentsData[0].data.centerNumberOriginal;
                  const oldClaimsPaid = claimsData[lobData].ClaimsLobSummary[0].AmountPaid;
                  paymentsData[0].data.sdata = this.common.trendNegativeMeansBad(newClaimsPaid, oldClaimsPaid);
                }
              }
            }*/
          }
        }

        resolve(paymentsData);
      });
    });
  }

  getPaymentsData(parameters) {
    return new Promise((resolve, reject) => {
      const summaryData: Array<object> = [];
      let claimsPaid: object;
      let claimsPaidRate: object;
      let claimsSubmitted: object;
      let claimsTAT: object;
      this.gettingReimbursedService.getPaymentsData(parameters).subscribe(
        claimsData => {
          const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
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
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Mr')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Cs')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Ei')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Un')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                }
              }
              if (lobData !== 'All') {
                paidData.push(
                  claimsData.All.ClaimsLobSummary[0].AmountPaid - claimsData[lobData].ClaimsLobSummary[0].AmountPaid
                );
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
                  color: this.common.returnLobColor(claimsData, lobData), // colorcodes,
                  gdata: ['card-inner', 'claimsPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.common.returnHoverLabels(claimsData, lobData),
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
                    color: this.common.returnLobColor(claimsData, lobData),
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    labels: this.common.returnHoverLabels(claimsData, lobData),
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              const paidData = [];
              const paidLOBBoolean = [false, false, false, false];
              if (claimsData.hasOwnProperty('Mr') && claimsData.Mr != null) {
                if (
                  claimsData.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Mr.ClaimsLobSummary.length &&
                  claimsData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Mr')
                ) {
                  paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
                  paidLOBBoolean[0] = true;
                }
              }
              if (claimsData.hasOwnProperty('Cs') && claimsData.Cs != null) {
                if (
                  claimsData.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Cs.ClaimsLobSummary.length &&
                  claimsData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Cs')
                ) {
                  paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
                  paidLOBBoolean[1] = true;
                }
              }
              if (claimsData.hasOwnProperty('Ei') && claimsData.Ei != null) {
                if (
                  claimsData.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Ei.ClaimsLobSummary.length &&
                  claimsData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Ei')
                ) {
                  paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
                  paidLOBBoolean[2] = true;
                }
              }
              if (claimsData.hasOwnProperty('Un') && claimsData.Un != null) {
                if (
                  claimsData.Un.hasOwnProperty('ClaimsLobSummary') &&
                  claimsData.Un.ClaimsLobSummary.length &&
                  claimsData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
                  (lobData === 'All' || lobData === 'Un')
                ) {
                  paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
                  paidLOBBoolean[3] = true;
                }
              }
              if (lobData !== 'All') {
                paidData.push(
                  claimsData.All.ClaimsLobSummary[0].AmountPaid - claimsData[lobData].ClaimsLobSummary[0].AmountPaid
                );
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
                  labels: this.common.LOBSideLabels(lobData, paidLOBBoolean),
                  color: this.common.LOBSideLabelColors(lobData, paidLOBBoolean)
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
              claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate') &&
              claimsData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() !== 0
            ) {
              // used toggle: true as toggle functionality is not built properly : srikar bobbiganipalli
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Yield',
                toggle: !environment.internalAccess,
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
                title: null,
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
          //  const payments = { id: 1, title: 'Claims Payments', data: [claimsPaid, claimsPaidRate] };
          /*, claimsPaidRate] }; commented to supress claims yield card*/
          summaryData[0] = claimsPaid;
          if (environment.claimsYieldAccess) {
            summaryData[1] = claimsPaidRate;
          }

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

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  public getclaimsPaidData(param) {
    this.providerKey = this.session.providerKeyData();
    let parameters = [];
    parameters = this.getParameterCategories(param);
    // let paidArray:  Array<Object> = [];
    return new Promise((resolve, reject) => {
      let paidBreakdown = [];
      let paidArray: Array<Object> = [];
      this.gettingReimbursedService.getPaymentData(...parameters).subscribe(paymentDatafetch => {
        try {
          const paymentData = JSON.parse(JSON.stringify(paymentDatafetch));
          const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
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
            type: 'donutWithLabelBottom',
            status: 500,
            title: 'Claims Paid Breakdown',
            MetricID: 'NA',
            data: null,
            besideData: null,
            bottomData: null,
            timeperiod: null
          };
          resolve(temp);
          console.log('Claims breakdown issue', Error);
        }
      });
    });
  }
}
