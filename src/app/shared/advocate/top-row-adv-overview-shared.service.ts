import { Injectable } from '@angular/core';
import { TopRowAdvOverviewService } from '../../rest/advocate/top-row-adv-overview.service';
import { AdvocateModule } from '../../components/advocate/advocate.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { GettingReimbursedSharedService } from '../getting-reimbursed/getting-reimbursed-shared.service';

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
  public c;
  constructor(
    private topRowService: TopRowAdvOverviewService,
    private MetricidService: GlossaryMetricidService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private gettingReimbursedSharedService: GettingReimbursedSharedService
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
          console.log('Param', param);
          console.log('parameters', parameters);
          console.log('paymentData', paymentData);
          this.a = {};
          this.b = {};
          this.c = {};
          this.claimSubmissionsData(parameters, paymentData).then(submission => {
            this.a = submission;
            /*  return this.gettingReimbursedSharedService.sharedPaymentData(parameters);
          })
          .then(payment => {
            this.b = payment[0][0];
            return this.gettingReimbursedSharedService.sharedNonPaymentData(param);
          })
          .then(nonPayment => {
            this.c = nonPayment[0];
console.log(' this.a',  this.a);
console.log(' this.b',  this.b);
console.log(' this.c',  this.c);
*/
            paymentDataResolve.push(
              this.a,
              // this.totalClaimsSubmittedMethod(param, paymentData),
              // this.claimsPaidMethod(param, paymentData),
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
    console.log('claims Yield', claimsYield);
    return claimsYield;
  }

  claimSubmissionsData(parameters, claimsData) {
    let claimsSubmitted: object;
    let timePeriodData: String;
    return new Promise((resolve, reject) => {
      const lobFullData = parameters[1].Lob ? this.common.getFullLobData(parameters[1].Lob) : 'ALL';
      const lobData = parameters[1].Lob ? _.startCase(parameters[1].Lob.toLowerCase()) : 'All';

      if (parameters[1]['ClaimsBy'] === 'DOS') {
        if (claimsData.hasOwnProperty('Startdate') && claimsData.hasOwnProperty('Enddate')) {
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
        if (claimsData.hasOwnProperty('StartDate') && claimsData.hasOwnProperty('EndDate')) {
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
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('ApprovedCount') &&
            claimsData.LineOfBusiness[lobFullData].ClaimFinancialMetrics.hasOwnProperty('DeniedCount')
          ) {
            const startDate = (claimsData || {}).StartDate;

            const endDate = (claimsData || {}).EndDate;
            const timePeriodCalls: String = this.common.dateFormat(startDate) + ' - ' + this.common.dateFormat(endDate);
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
}
