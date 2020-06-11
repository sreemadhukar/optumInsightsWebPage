/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedService } from '../../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../../common-utils.service';
import { SessionService } from '../../session.service';
import { GettingReimbursedPayload } from '../payload.class';
import * as _ from 'lodash';
import { AuthorizationService } from 'src/app/auth/_service/authorization.service';
import { lobName } from '../../../modals/lob-name';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsSharedService {
  public nonPaymentData: any = null;
  private timeFrame: string;
  private providerKey: number;
  private isInternalInt: boolean = environment.internalIntAccess;
  constructor(
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
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
      const toggleData = { isSummary: false, page: 'Claims Payments', menu: 'Getting Reimbursed' };
      this.getPaymentsData(parameters, toggleData)
        .then(paydata => {
          const paymentdata = paydata[0];
          return this.calculateTrends(parameters, paymentdata);
        })
        .then(data => {
          const payments = { id: 1, title: 'Claims Payments', data: data };
          summaryData[0] = payments;
          resolve(summaryData);
        });
    });
  }

  calculateTrends(parameters, paymentsData) {
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

  getLob(lobData) {
    switch (lobData) {
      case 'Mr':
        return (lobData = 'MedicareAndRetirement');
      case 'Cs':
        return (lobData = 'CommunityAndState');
      case 'Ei':
        return (lobData = 'EmployerAndIndividual');
      case 'Un':
        return (lobData = 'UNKNOWN');
    }
  }

  getApprovedAmount(claimsData, paidData, lobData) {
    if (
      _.get(claimsData.LineOfBusiness, 'MedicareAndRetirement.ClaimFinancialMetrics.ApprovedAmount') != null &&
      (lobData === 'ALL' || lobData === 'MedicareAndRetirement')
    ) {
      paidData.push(claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.ApprovedAmount);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'CommunityAndState.ClaimFinancialMetrics.ApprovedAmount') != null &&
      (lobData === 'ALL' || lobData === 'CommunityAndState')
    ) {
      paidData.push(claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.ApprovedAmount);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'EmployerAndIndividual.ClaimFinancialMetrics.ApprovedAmount') != null &&
      (lobData === 'ALL' || lobData === 'EmployerAndIndividual')
    ) {
      paidData.push(claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.ApprovedAmount);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'UNKNOWN.ClaimFinancialMetrics.ApprovedAmount') != null &&
      (lobData === 'ALL' || lobData === 'UNKNOWN')
    ) {
      paidData.push(claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.ApprovedAmount);
    }
    if (lobData !== 'ALL') {
      paidData.push(
        claimsData.LineOfBusiness.ALL.ClaimFinancialMetrics.ApprovedAmount -
          claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
      );
    }
  }

  getAmountPaid(claimsData, paidData, lobData) {
    if (_.get(claimsData, ['Mr', 'ClaimsLobSummary', '0', 'AmountPaid']) && (lobData === 'All' || lobData === 'Mr')) {
      paidData.push(claimsData.Mr.ClaimsLobSummary[0].AmountPaid);
    }
    if (_.get(claimsData, ['Cs', 'ClaimsLobSummary', '0', 'AmountPaid']) && (lobData === 'All' || lobData === 'Cs')) {
      paidData.push(claimsData.Cs.ClaimsLobSummary[0].AmountPaid);
    }
    if (_.get(claimsData, ['Ei', 'ClaimsLobSummary', '0', 'AmountPaid']) && (lobData === 'All' || lobData === 'Ei')) {
      paidData.push(claimsData.Ei.ClaimsLobSummary[0].AmountPaid);
    }
    if (_.get(claimsData, ['Un', 'ClaimsLobSummary', '0', 'AmountPaid']) && (lobData === 'All' || lobData === 'Un')) {
      paidData.push(claimsData.Un.ClaimsLobSummary[0].AmountPaid);
    }
    if (lobData !== 'All') {
      paidData.push(claimsData.All.ClaimsLobSummary[0].AmountPaid - claimsData[lobData].ClaimsLobSummary[0].AmountPaid);
    }
  }

  getAmountDenied(claimsData, notPaidData, lobData) {
    if (
      _.get(claimsData.LineOfBusiness, 'MedicareAndRetirement.ClaimFinancialMetrics.AmountDenied') != null &&
      (lobData === 'ALL' || lobData === 'MedicareAndRetirement')
    ) {
      notPaidData.push(claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.AmountDenied);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'CommunityAndState.ClaimFinancialMetrics.AmountDenied') != null &&
      (lobData === 'ALL' || lobData === 'CommunityAndState')
    ) {
      notPaidData.push(claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.AmountDenied);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'EmployerAndIndividual.ClaimFinancialMetrics.AmountDenied') != null &&
      (lobData === 'ALL' || lobData === 'EmployerAndIndividual')
    ) {
      notPaidData.push(claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.AmountDenied);
    }
    if (
      _.get(claimsData.LineOfBusiness, 'UNKNOWN.ClaimFinancialMetrics.AmountDenied') != null &&
      (lobData === 'ALL' || lobData === 'UNKNOWN')
    ) {
      notPaidData.push(claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.AmountDenied);
    }
    if (lobData !== 'ALL') {
      notPaidData.push(
        claimsData.LineOfBusiness.ALL.ClaimFinancialMetrics.AmountDenied -
          claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.AmountDenied
      );
    }
  }

  public getPaymentsData(parameters, toggleData) {
    return new Promise(resolve => {
      let summaryData: Array<object> = [];
      let claimsPaid: object;
      let claimsPaidRate: object;
      this.gettingReimbursedService.getPaymentsData(parameters).subscribe(
        claimsData => {
          let lobData;
          if (parameters[1]['ClaimsBy'] === 'DOP') {
            lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'ALL';
            if (!claimsData || !claimsData.hasOwnProperty('LineOfBusiness')) {
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
                toggle: true,
                data: null,
                timeperiod: null
              };
            } else if (claimsData != null) {
              this.getLob(lobData);
              if (
                claimsData.LineOfBusiness.hasOwnProperty(lobData) &&
                claimsData.LineOfBusiness[lobData] != null &&
                claimsData.LineOfBusiness[lobData].hasOwnProperty('ClaimFinancialMetrics') &&
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.hasOwnProperty('ApprovedAmount')
              ) {
                const paidData = [];
                this.getApprovedAmount(claimsData, paidData, lobData);
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  data: {
                    graphValues: paidData,
                    centerNumber:
                      this.common.nFormatter(claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount) <
                        1 &&
                      this.common.nFormatter(claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount) >
                        0
                        ? '< $1'
                        : '$' +
                          this.common.nFormatter(
                            claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
                          ),
                    centerNumberOriginal: claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount,
                    color: this.common.returnLobColor(claimsData.LineOfBusiness, lobData),
                    gdata: ['card-inner', 'claimsPaid'],
                    sdata: {
                      sign: '',
                      data: ''
                    },
                    labels: this.common.returnHoverLabels(claimsData.LineOfBusiness, lobData),
                    hover: true
                  },
                  besideData: {
                    labels: this.common.lobNameForSideLabels(lobData, claimsData.LineOfBusiness),
                    color: this.common.lobColorForLabels(lobData, claimsData.LineOfBusiness)
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.EndDate)
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
                claimsData.LineOfBusiness.hasOwnProperty(lobData) &&
                claimsData.LineOfBusiness[lobData] != null &&
                claimsData.LineOfBusiness[lobData].hasOwnProperty('ClaimFinancialMetrics') &&
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
              ) {
                const notPaidData = [];
                this.getAmountDenied(claimsData, notPaidData, lobData);
                claimsPaidRate = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Yield',
                  toggle: true,
                  data: {
                    graphValues: notPaidData,
                    centerNumber:
                      this.common.nFormatter(claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount) <
                        1 &&
                      this.common.nFormatter(claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount) >
                        0
                        ? '< $1'
                        : '$' +
                          this.common.nFormatter(
                            claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
                          ),
                    centerNumberOriginal: claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount,
                    color: this.common.returnLobColor(claimsData.LineOfBusiness, lobData),
                    gdata: ['card-inner', 'claimsPaidRate'],
                    sdata: {
                      sign: '',
                      data: ''
                    },
                    labels: this.common.returnHoverLabels(claimsData.LineOfBusiness, lobData),
                    hover: true
                  },
                  besideData: {
                    labels: this.common.lobNameForSideLabels(lobData, claimsData.LineOfBusiness),
                    color: this.common.lobColorForLabels(lobData, claimsData.LineOfBusiness)
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.EndDate)
                };
              } else {
                claimsPaidRate = {
                  category: 'app-card',
                  type: 'donut',
                  toggle: true,
                  status: 404,
                  title: 'Claims Yield',
                  data: null,
                  timeperiod: null
                };
              }
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                // toggle: true,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
              claimsPaidRate = {
                category: 'app-card',
                type: 'donut',
                toggle: true,
                status: 404,
                title: 'Claims Yield',
                data: null,
                timeperiod: null
              };
            }
          } else {
            lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
            if (!claimsData || !claimsData.hasOwnProperty(lobData)) {
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
                timeperiod: null,
                toggle: !this.toggle.setToggles('Claims Yield', toggleData.page, toggleData.menu, toggleData.isSummary)
              };
            } else if (claimsData != null) {
              if (
                claimsData.hasOwnProperty(lobData) &&
                claimsData[lobData] != null &&
                claimsData[lobData].hasOwnProperty('ClaimsLobSummary') &&
                claimsData[lobData].ClaimsLobSummary.length &&
                claimsData[lobData].ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
              ) {
                const paidData = [];
                this.getAmountPaid(claimsData, paidData, lobData);
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
                    labels: [
                      lobName.mAndRMedicare,
                      lobName.cAndSMedicaid,
                      lobName.eAndICommerCial,
                      lobName.unCategorized
                    ],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.Enddate)
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
                      labels: [
                        lobName.mAndRMedicare,
                        lobName.cAndSMedicaid,
                        lobName.eAndICommerCial,
                        lobName.unCategorized
                      ],
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                    },
                    timeperiod:
                      this.common.dateFormat(claimsData.Startdate) +
                      '&ndash;' +
                      this.common.dateFormat(claimsData.Enddate)
                  };
                } // Date : 31/5/2019
              } else {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  status: 404,
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
                  timeperiod:
                    this.common.dateFormat(claimsData.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.Enddate)
                };
              } else {
                claimsPaid = {
                  category: 'app-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  status: 404,
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
                  toggle: !this.toggle.setToggles(
                    'Claims Yield',
                    toggleData.page,
                    toggleData.menu,
                    toggleData.isSummary
                  ),
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
                  timeperiod:
                    this.common.dateFormat(claimsData.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.Enddate)
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
            } else {
              claimsPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                // toggle: true,
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
                timeperiod: null,
                toggle: !this.toggle.setToggles('Claims Yield', toggleData.page, toggleData.menu, toggleData.isSummary)
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
          if (this.isInternalInt) {
            summaryData = [[claimsPaid, claimsPaidRate], claimsData];
          } else {
            summaryData = [[claimsPaid], claimsData];
          }
          console.log('summaryData', summaryData);
          if (summaryData.length) {
            resolve(summaryData);
          }
        },
        err => {
          console.log('Payments Shared Data', err);
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
    let paidArray;
    parameters = this.getParameterCategories(param);
    // let paidArray:  Array<Object> = [];
    if (param.viewClaimsByFilter === 'DOP') {
      return new Promise(resolve => {
        let paidBreakdown = [];
        this.gettingReimbursedService.getPaymentData(...parameters).subscribe((paymentDatafetch: any) => {
          try {
            const providerData = paymentDatafetch[0];
            const paymentData = paymentDatafetch[1];
            const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'ALL';
            this.getLob(lobData);
            if (
              providerData !== null &&
              providerData.LineOfBusiness &&
              paymentData.LineOfBusiness[lobData] &&
              paymentData.LineOfBusiness[lobData].hasOwnProperty('ClaimFinancialMetrics')
            ) {
              paidBreakdown = [
                providerData.LineOfBusiness[lobData].ProviderFinancialMetrics.ChargeAmount,
                providerData.LineOfBusiness[lobData].ProviderFinancialMetrics.AllowedAmount,
                paymentData.LineOfBusiness[lobData].ClaimFinancialMetrics.DeniedAmount,
                paymentData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
              ];
              paidArray = {
                data: paidBreakdown,
                timePeriod:
                  this.common.dateFormat(paymentData.StartDate) +
                  '&ndash;' +
                  this.common.dateFormat(paymentData.EndDate)
              };
            } else {
              paidArray = {
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
            }
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
            console.log('Claims breakdown issue', Error);
            resolve(temp);
          }
        });
      });
    } else {
      return new Promise(resolve => {
        let paidBreakdown = [];
        this.gettingReimbursedService.getPaymentData(...parameters).subscribe(paymentDatafetch => {
          try {
            const paymentData = paymentDatafetch;
            const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
            if (
              paymentData !== null &&
              paymentData[lobData] &&
              paymentData[lobData].hasOwnProperty('ClaimsLobSummary')
            ) {
              paidBreakdown = [
                paymentData[lobData].ClaimsLobSummary[0].AmountBilled,
                paymentData[lobData].ClaimsLobSummary[0].AmountActualAllowed,
                //  + paymentData[lobData].ClaimsLobSummary[0].PatientResponsibleAmount,
                paymentData[lobData].ClaimsLobSummary[0].AmountDenied,
                paymentData[lobData].ClaimsLobSummary[0].AmountUHCPaid
              ];
              paidArray = {
                data: paidBreakdown,
                timePeriod:
                  this.common.dateFormat(paymentData.Startdate) +
                  '&ndash;' +
                  this.common.dateFormat(paymentData.Enddate)
              };
            } else {
              paidArray = {
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
            }
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
            console.log('Claims breakdown issue', Error);
            resolve(temp);
          }
        });
      });
    }
  }
}
