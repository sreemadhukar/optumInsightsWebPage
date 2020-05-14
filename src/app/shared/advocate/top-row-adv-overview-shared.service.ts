import { Injectable } from '@angular/core';
import { TopRowAdvOverviewService } from '../../rest/advocate/top-row-adv-overview.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import * as _ from 'lodash';
import { lobName } from '../../modals/lob-name';

@Injectable({
  providedIn: 'root'
})
export class TopRowAdvOverviewSharedService {
  public timeFrame;
  public tin;
  public lob;
  public providerKey;
  public a;
  public b;

  constructor(
    private topRowService: TopRowAdvOverviewService,
    private MetricidService: GlossaryMetricidService,
    private common: CommonUtilsService,
    private session: SessionService,
    private readonly toggle: AuthorizationService
  ) {}
  /** Function to show hovers labels as per Lob**/

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  // The getNonPayment() function fetches data for Claims Not Paid and Claims Non-Payment Rate
  public getPaymentShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.topRowService.getPaymentsData(parameters).subscribe(
        paymentData => {
          const paymentDataResolve = [];
          this.a = {};
          this.b = {};

          this.claimSubmissionsData(parameters, paymentData)
            .then(submission => {
              this.a = submission;
              return this.sharedPaymentData(parameters);
            })
            .then(payment => {
              this.b = payment;
              paymentDataResolve.push(
                this.a,
                this.b,

                this.claimsNotPaidMethod(param, paymentData)
              );
              resolve(paymentDataResolve);
            });
        },
        err => {
          console.log('Advocate Page , Error for Payment cards', err);
        }
      );
    });
  }
  public totalClaimsSubmittedMethod(param, paymentData): Object {
    let claimsSubmitted: Object;
    const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    if (
      paymentData.hasOwnProperty(lobData) &&
      paymentData[lobData] != null &&
      paymentData[lobData].hasOwnProperty('ClaimsLobSummary') &&
      paymentData[lobData].ClaimsLobSummary.length &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
    ) {
      claimsSubmitted = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Submitted',
        toggle: this.toggle.setToggles('Claims Submitted', 'TopRow', 'OverviewAdvocate', false),
        MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
        data: {
          graphValues: [
            paymentData[lobData].ClaimsLobSummary[0].ClaimsPaid,
            paymentData[lobData].ClaimsLobSummary[0].ClaimsDenied
          ],
          centerNumber: this.common.nFormatter(paymentData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
          color: ['#3381FF', '#80B0FF'],
          gdata: ['card-inner', 'totalClaimsSubmitted'],
          besideData: {
            labels: ['Paid', 'Not Paid'],
            color: ['#3381FF', '#80B0FF']
          },
          labels: ['Paid', 'Not Paid'],
          hover: true
        },
        sdata: {
          sign: '',
          data: ''
        },
        timeperiod:
          this.common.dateFormat(paymentData.Startdate) + '&ndash;' + this.common.dateFormat(paymentData.Enddate)
      };
    } else {
      claimsSubmitted = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Submitted',
        MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
        data: null,
        status: 404,
        besideData: null,
        timeperiod: this.timeFrame
      };
    }
    return claimsSubmitted;
  }
  public claimsPaidMethod(param, paymentData): Object {
    const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    let claimsPaid: Object;
    if (
      (paymentData || {}).All &&
      paymentData.All.hasOwnProperty('ClaimsLobSummary') &&
      paymentData.All.ClaimsLobSummary.length &&
      paymentData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
    ) {
      const nonPaidData = [];
      if (paymentData.hasOwnProperty('Mr') && paymentData.Mr != null) {
        if (
          paymentData.Mr.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Mr.ClaimsLobSummary.length &&
          paymentData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Mr.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Cs') && paymentData.Cs != null) {
        if (
          paymentData.Cs.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Cs.ClaimsLobSummary.length &&
          paymentData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Cs.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Ei') && paymentData.Ei != null) {
        if (
          paymentData.Ei.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Ei.ClaimsLobSummary.length &&
          paymentData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Ei.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Un') && paymentData.Un != null) {
        if (
          paymentData.Un.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Un.ClaimsLobSummary.length &&
          paymentData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Un.ClaimsLobSummary[0].AmountPaid);
        }
      }
      claimsPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Paid',
        toggle: this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
        MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
        data: {
          graphValues: nonPaidData,
          centerNumber:
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid) > 0
              ? '< $1'
              : '$' + this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid),
          color: this.common.returnLobColor(paymentData, lobData),
          gdata: ['card-inner', 'claimsPaid'],
          besideData: {
            labels: ['M&R', 'C&S', 'E&I', 'Uncategorized'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          labels: this.common.returnHoverLabels(paymentData, lobData),
          hover: true
        },
        sdata: {
          sign: '',
          data: ''
        },
        timeperiod:
          this.common.dateFormat(paymentData.Startdate) + '&ndash;' + this.common.dateFormat(paymentData.Enddate)
      };
    } else {
      claimsPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Claims Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
    }
    return claimsPaid;
  }
  public claimsNotPaidMethod(param, paymentData): Object {
    const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    let claimsNotPaid: Object;
    if (
      (paymentData || {}).All &&
      paymentData.All.hasOwnProperty('ClaimsLobSummary') &&
      paymentData.All.ClaimsLobSummary.length &&
      paymentData.All.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
    ) {
      const nonPaidData = [];
      if (paymentData.hasOwnProperty('Mr') && paymentData.Mr != null) {
        if (
          paymentData.Mr.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Mr.ClaimsLobSummary.length &&
          paymentData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Mr.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Cs') && paymentData.Cs != null) {
        if (
          paymentData.Cs.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Cs.ClaimsLobSummary.length &&
          paymentData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Cs.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Ei') && paymentData.Ei != null) {
        if (
          paymentData.Ei.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Ei.ClaimsLobSummary.length &&
          paymentData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Ei.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Un') && paymentData.Un != null) {
        if (
          paymentData.Un.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Un.ClaimsLobSummary.length &&
          paymentData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Un.ClaimsLobSummary[0].AmountDenied);
        }
      }
      claimsNotPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Not Paid',
        metricInProgres: true,
        MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
        toggle: this.toggle.setToggles('Claims Not Paid', 'TopRow', 'OverviewAdvocate', false),
        data: {
          graphValues: nonPaidData,
          centerNumber:
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied) < 1 &&
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied) > 0
              ? '< $1'
              : '$' + this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied),
          color: this.common.returnLobColor(paymentData, lobData),
          gdata: ['card-inner', 'claimsNotPaid'],
          besideData: {
            labels: ['M&R', 'C&S', 'E&I', 'Uncategorized'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          labels: this.common.returnHoverLabels(paymentData, lobData),
          hover: true
        },
        sdata: {
          sign: '',
          data: ''
        },
        timeperiod:
          this.common.dateFormat(paymentData.Startdate) + '&ndash;' + this.common.dateFormat(paymentData.Enddate)
      };
    } else {
      claimsNotPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        // status: '404',
        title: 'Claims Not Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null,
        metricInProgres: true
      };
    }
    return claimsNotPaid;
  }

  public getClaimsYieldShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.topRowService.getPaymentData(...parameters).subscribe(
        yieldData => {
          resolve(this.claimsYieldMethod(param, yieldData));
        },
        err => {
          console.log('Advocate Page , Error for Payment cards', err);
        }
      );
    });
  }

  public claimsYieldMethod(param, yieldData): Object {
    const lobData = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    let claimsYield: Object;
    if (
      yieldData.hasOwnProperty(lobData) &&
      yieldData[lobData] != null &&
      yieldData[lobData].hasOwnProperty('ClaimsLobSummary') &&
      yieldData[lobData].ClaimsLobSummary.length &&
      yieldData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
      yieldData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate') &&
      yieldData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() !== 0
    ) {
      // used toggle: true as toggle functionality is not built properly : srikar bobbiganipalli
      claimsYield = {
        category: 'app-card',
        type: 'donut',
        title: 'Claims Yield*',
        toggle: this.toggle.setToggles('Claims Yield', 'BottomRow', 'OverviewAdvocate', false),
        data: {
          graphValues: [
            yieldData[lobData].ClaimsLobSummary[0].ClaimsYieldRate,
            yieldData[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate
          ],
          centerNumber: yieldData[lobData].ClaimsLobSummary[0].ClaimsYieldRate.toFixed() + '%',
          color: ['#3381FF', '#D7DCE1'],
          gdata: ['card-inner', 'claimsYield'],
          sdata: null
        },
        timeperiod: this.common.dateFormat(yieldData.Startdate) + '&ndash;' + this.common.dateFormat(yieldData.Enddate)
      };
    } else {
      claimsYield = {
        category: 'app-card',
        type: 'donut',
        data: null,
        timeperiod: null,
        status: 404,
        title: 'Claims Yield',
        MetricID: this.MetricidService.MetricIDs.ClaimsYield
      };
    }
    return claimsYield;
  }

  claimSubmissionsData(parameters, claimsData) {
    let claimsSubmitted: object;
    let timePeriodData: String;
    return new Promise(resolve => {
      const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
      const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';

      if (parameters[1]['ClaimsBy'] === 'DOS') {
        if (claimsData && claimsData.hasOwnProperty('Startdate') && claimsData.hasOwnProperty('Enddate')) {
          timePeriodData =
            this.common.dateFormat(claimsData.Startdate) + '&ndash;' + this.common.dateFormat(claimsData.Enddate);
        }

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
            claimsSubmitted = {
              category: 'small-card',
              type: 'donutWithLabel',
              title: 'Claims Submitted',
              toggle: this.toggle.setToggles('Claims Submitted', 'TopRow', 'OverviewAdvocate', false),
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: {
                graphValues: [
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                  claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                ],
                centerNumberOriginal: claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted,
                centerNumber: this.common.nFormatter(claimsData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
                color: ['#3381FF', '#80B0FF'],
                gdata: ['card-inner', 'totalClaimsSubmitted'],
                besideData: {
                  labels: ['Paid', 'Not Paid'],
                  color: ['#3381FF', '#80B0FF'],
                  graphValues: [
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsPaid,
                    claimsData[lobData].ClaimsLobSummary[0].ClaimsDenied
                  ]
                },
                labels: ['Paid', 'Not Paid'],
                hover: true
              },
              sdata: {
                sign: '',
                data: ''
              },
              timeperiod: timePeriodData
            };

            resolve(claimsSubmitted);
          } else {
            claimsSubmitted = {
              category: 'small-card',
              type: 'donutWithLabel',
              title: 'Claims Submitted',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: null,
              status: 404,
              besideData: null,
              timeperiod: this.timeFrame
            };

            resolve(claimsSubmitted);
          }
        } else {
          claimsSubmitted = {
            category: 'small-card',
            type: 'donutWithLabel',
            title: 'Claims Submitted',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            status: 404,
            besideData: null,
            timeperiod: this.timeFrame
          };

          resolve(claimsSubmitted);
        }
      } else {
        if (claimsData && claimsData.hasOwnProperty('StartDate') && claimsData.hasOwnProperty('EndDate')) {
          timePeriodData =
            this.common.dateFormat(claimsData.StartDate) + '&ndash;' + this.common.dateFormat(claimsData.EndDate);
        }

        if (!claimsData || !claimsData.hasOwnProperty('LineOfBusiness')) {
          claimsSubmitted = {
            category: 'small-card',
            type: 'donutWithLabel',
            title: 'Claims Submitted',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            status: 404,
            besideData: null,
            timeperiod: this.timeFrame
          };
          resolve(claimsSubmitted);
        } else if (claimsData != null) {
          if (
            claimsData.LineOfBusiness.hasOwnProperty(lobFullData) &&
            claimsData.LineOfBusiness[lobFullData] != null &&
            claimsData.LineOfBusiness[lobFullData].hasOwnProperty('ClaimFinancialMetrics') &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics != null &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('ApprovedCount') &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('DeniedCount')
          ) {
            claimsSubmitted = {
              category: 'small-card',
              type: 'donutWithLabel',
              title: 'Claims Submitted',
              toggle: this.toggle.setToggles('Claims Submitted', 'TopRow', 'OverviewAdvocate', false),
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
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
                besideData: {
                  labels: ['Paid', 'Not Paid'],
                  color: ['#3381FF', '#80B0FF'],
                  graphValues: [
                    claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.ApprovedCount,
                    claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.DeniedCount
                  ]
                },
                labels: ['Paid', 'Not Paid'],
                hover: true
              },
              sdata: {
                sign: '',
                data: ''
              },
              timeperiod: timePeriodData
            };
            resolve(claimsSubmitted);
          } else {
            claimsSubmitted = {
              category: 'small-card',
              type: 'donutWithLabel',
              title: 'Claims Submitted',
              MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
              data: null,
              status: 404,
              besideData: null,
              timeperiod: this.timeFrame
            };
            resolve(claimsSubmitted);
          }
        } else {
          claimsSubmitted = {
            category: 'small-card',
            type: 'donutWithLabel',
            title: 'Claims Submitted',
            MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
            data: null,
            status: 404,
            besideData: null,
            timeperiod: this.timeFrame
          };
          resolve(claimsSubmitted);
        }
      }
    });
  }

  public sharedPaymentData(param) {
    /** Non Payment Service Code starts here */
    /** code for two donuts  Claims Not Paid and Claims Non-payment Rate */
    let tempPaymentData: any;
    return new Promise(resolve => {
      this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
        this.getPaymentsData(param)
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

  public getPaymentsData(parameters) {
    return new Promise(resolve => {
      let claimsPaid: object;
      this.topRowService.getPaymentsData(parameters).subscribe(
        claimsData => {
          let lobData;
          if (parameters[1]['ClaimsBy'] === 'DOP') {
            lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'ALL';
            if (!claimsData || !claimsData.hasOwnProperty('LineOfBusiness')) {
              claimsPaid = {
                category: 'small-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            } else if (claimsData != null) {
              if (lobData === 'Mr') {
                lobData = 'MedicareAndRetirement';
              } else if (lobData === 'Cs') {
                lobData = 'CommunityAndState';
              } else if (lobData === 'Ei') {
                lobData = 'EmployerAndIndividual';
              } else if (lobData === 'Un') {
                lobData = 'UNKNOWN';
              }
              if (
                claimsData.LineOfBusiness.hasOwnProperty(lobData) &&
                claimsData.LineOfBusiness[lobData] != null &&
                claimsData.LineOfBusiness[lobData].hasOwnProperty('ClaimFinancialMetrics') &&
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics != null &&
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.hasOwnProperty('ApprovedAmount')
              ) {
                const paidData = [];
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
                  claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.hasOwnProperty(
                      'ApprovedAmount'
                    ) &&
                    (lobData === 'ALL' || lobData === 'MedicareAndRetirement')
                  ) {
                    paidData.push(claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.ApprovedAmount);
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
                  claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.CommunityAndState.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.hasOwnProperty(
                      'ApprovedAmount'
                    ) &&
                    (lobData === 'ALL' || lobData === 'CommunityAndState')
                  ) {
                    paidData.push(claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.ApprovedAmount);
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
                  claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.hasOwnProperty(
                      'ApprovedAmount'
                    ) &&
                    (lobData === 'ALL' || lobData === 'EmployerAndIndividual')
                  ) {
                    paidData.push(claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.ApprovedAmount);
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('UNKNOWN') &&
                  claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.UNKNOWN.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.hasOwnProperty('ApprovedAmount') &&
                    (lobData === 'ALL' || lobData === 'UNKNOWN')
                  ) {
                    paidData.push(claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.ApprovedAmount);
                  }
                }
                if (lobData !== 'ALL') {
                  paidData.push(
                    claimsData.LineOfBusiness.ALL.ClaimFinancialMetrics.ApprovedAmount -
                      claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
                  );
                }

                claimsPaid = {
                  category: 'small-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  toggle: this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
                  MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                    labels: this.common.returnHoverLabels(claimsData.LineOfBusiness, lobData),
                    hover: true,
                    besideData: {
                      labels: this.common.lobNameForSideLabels(lobData, claimsData.LineOfBusiness),
                      color: this.common.lobColorForLabels(lobData, claimsData.LineOfBusiness)
                    }
                  },
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.StartDate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.EndDate)
                };
              } else {
                claimsPaid = {
                  category: 'small-card',
                  type: 'donutWithLabel',
                  status: 404,
                  title: 'Claims Paid',
                  MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics != null &&
                claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
              ) {
                const notPaidData = [];
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
                  claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
                  ) {
                    notPaidData.push(
                      claimsData.LineOfBusiness.MedicareAndRetirement.ClaimFinancialMetrics.AmountDenied
                    );
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('CommunityAndState') &&
                  claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.CommunityAndState.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
                  ) {
                    notPaidData.push(claimsData.LineOfBusiness.CommunityAndState.ClaimFinancialMetrics.AmountDenied);
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
                  claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
                  ) {
                    notPaidData.push(
                      claimsData.LineOfBusiness.EmployerAndIndividual.ClaimFinancialMetrics.AmountDenied
                    );
                  }
                }
                if (
                  claimsData.LineOfBusiness.hasOwnProperty('UNKNOWN') &&
                  claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics != null
                ) {
                  if (
                    claimsData.LineOfBusiness.UNKNOWN.hasOwnProperty('ClaimFinancialMetrics') &&
                    claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.hasOwnProperty('AmountDenied')
                  ) {
                    notPaidData.push(claimsData.LineOfBusiness.UNKNOWN.ClaimFinancialMetrics.AmountDenied);
                  }
                }
                if (lobData !== 'ALL') {
                  notPaidData.push(
                    claimsData.LineOfBusiness.ALL.ClaimFinancialMetrics.ApprovedAmount -
                      claimsData.LineOfBusiness[lobData].ClaimFinancialMetrics.ApprovedAmount
                  );
                }
              } else {
              }
            } else {
              claimsPaid = {
                category: 'small-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
          } else {
            lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';
            if (!claimsData.hasOwnProperty(lobData)) {
              claimsPaid = {
                category: 'small-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
                data: null,
                besideData: null,
                bottomData: null,
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
                  category: 'small-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  toggle: this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
                  MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                    labels: this.common.returnHoverLabels(claimsData, lobData),
                    hover: true,
                    besideData: {
                      labels: [
                        lobName.mAndRMedicare,
                        lobName.cAndSMedicaid,
                        lobName.eAndICommerCial,
                        lobName.unCategorized
                      ],
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                    }
                  },
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.Enddate)
                };
                // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
                if (!paidData[0] && !paidData[1] && !paidData[2] && !paidData[3]) {
                  claimsPaid = {
                    category: 'small-card',
                    type: 'donutWithLabel',
                    title: 'Claims Paid',
                    toggle: this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
                    MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                      labels: this.common.returnHoverLabels(claimsData, lobData),
                      hover: true,
                      besideData: {
                        labels: [
                          lobName.mAndRMedicare,
                          lobName.cAndSMedicaid,
                          lobName.eAndICommerCial,
                          lobName.unCategorized
                        ],
                        color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                      }
                    },
                    sdata: {
                      sign: 'down',
                      data: '-2.8%'
                    },
                    timeperiod:
                      this.common.dateFormat(claimsData.Startdate) +
                      '&ndash;' +
                      this.common.dateFormat(claimsData.Enddate)
                  };
                } // Date : 31/5/2019
              } else {
                claimsPaid = {
                  category: 'small-card',
                  type: 'donutWithLabel',
                  status: 404,
                  title: 'Claims Paid',
                  MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
                  category: 'small-card',
                  type: 'donutWithLabel',
                  title: 'Claims Paid',
                  toggle: this.toggle.setToggles('Claims Paid', 'TopRow', 'OverviewAdvocate', false),
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
                    labels: this.common.returnHoverLabels(claimsData, lobData),
                    hover: true,
                    besideData: {
                      labels: this.common.LOBSideLabels(lobData, paidLOBBoolean),
                      color: this.common.LOBSideLabelColors(lobData, paidLOBBoolean)
                    }
                  },
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  timeperiod:
                    this.common.dateFormat(claimsData.Startdate) +
                    '&ndash;' +
                    this.common.dateFormat(claimsData.Enddate)
                };
              } else {
                claimsPaid = {
                  category: 'small-card',
                  type: 'donutWithLabel',
                  status: 404,
                  title: 'Claims Paid',
                  MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
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
              } else {
              }
            } else {
              claimsPaid = {
                category: 'small-card',
                type: 'donutWithLabel',
                status: 404,
                title: 'Claims Paid',
                MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
          }
          resolve(claimsPaid);
        },
        err => {
          console.log('Payments Shared Data', err);
        }
      );
    });
  }
}
