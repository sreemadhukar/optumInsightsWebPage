import { Injectable } from '@angular/core';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { OverviewAdvocateService } from '../../rest/advocate/overview-advocate.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OverviewAdvocateSharedService {
  public timeFrame;
  public tin;
  public lob;
  public providerKey;
  public collectiveBeData;
  public collectiveClaimsData;
  public collectivePaData;
  public collectiveOtherData;
  public monthName;
  public sendData: {};

  constructor(
    private MetricidService: GlossaryMetricidService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private overviewAdvocateService: OverviewAdvocateService
  ) {}

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  public getAppealsLeftShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'ALL';
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.appealsData(...parameters).subscribe(
        appealsLeftData => {
          resolve(appealsLeftData);
        },
        err => {
          console.log('Advocate Page , Error for appeals cards', err);
        }
      );
    });
  }

  public getAppealsTrendByMonthShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'ALL';
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.appealsDataTrendByMonth(...parameters).subscribe(
        appealsTrendData => {
          const mrData = [];
          const csData = [];
          const eiData = [];
          const other = [];
          if (appealsTrendData) {
            appealsTrendData.forEach(element => {
              const monthlyMrData = [];
              const monthlyCsData = [];
              const monthlyEiData = [];
              const monthlyOtherData = [];

              if (element.LineOfBusiness.MedicareAndRetirement) {
                monthlyMrData.push(element.LineOfBusiness.MedicareAndRetirement);
              }
              if (element.LineOfBusiness.CommunityAndState) {
                monthlyCsData.push(element.LineOfBusiness.CommunityAndState);
              }
              if (element.LineOfBusiness.EmployerAndIndividual) {
                monthlyEiData.push(element.LineOfBusiness.EmployerAndIndividual);
              }
              if (element.LineOfBusiness.Other) {
                monthlyOtherData.push(element.LineOfBusiness.Other);
              }

              if (monthlyMrData.length !== 0) {
                for (let i = 0; i < monthlyMrData.length; i++) {
                  const trendMonthValue = monthlyMrData[i].AdminAppeals + monthlyMrData[i].ClinicalAppeals;
                  const trendTimePeriod = element.ReportingPeriod;
                  const monthName = trendTimePeriod.substr(4, 4);

                  mrData.push({
                    name: monthName,
                    value: trendMonthValue,
                    month: trendTimePeriod
                  });
                }
              }

              if (monthlyCsData.length !== 0) {
                for (let i = 0; i < monthlyCsData.length; i++) {
                  const trendMonthValue = monthlyCsData[i].AdminAppeals + monthlyCsData[i].ClinicalAppeals;
                  const trendTimePeriod = element.ReportingPeriod;
                  const monthName = trendTimePeriod.substr(4, 4);

                  csData.push({
                    name: monthName,
                    value: trendMonthValue,
                    month: trendTimePeriod
                  });
                }
              }

              if (monthlyEiData.length !== 0) {
                for (let i = 0; i < monthlyEiData.length; i++) {
                  const trendMonthValue = monthlyEiData[i].AdminAppeals + monthlyEiData[i].ClinicalAppeals;
                  const trendTimePeriod = element.ReportingPeriod;
                  const monthName = trendTimePeriod.substr(4, 4);

                  eiData.push({
                    name: monthName,
                    value: trendMonthValue,
                    month: trendTimePeriod
                  });
                }
              }

              if (monthlyOtherData.length !== 0) {
                for (let i = 0; i < monthlyOtherData.length; i++) {
                  const trendMonthValue = monthlyOtherData[i].AdminAppeals + monthlyOtherData[i].ClinicalAppeals;
                  const trendTimePeriod = element.ReportingPeriod;
                  const monthName = trendTimePeriod.substr(4, 4);

                  other.push({
                    name: monthName,
                    value: trendMonthValue,
                    month: trendTimePeriod
                  });
                }
              }
            });
          }

          mrData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          csData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          eiData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          other.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });
          const appealsTrendFormattedData = {};
          if (mrData) {
            appealsTrendFormattedData['M&R'] = mrData;
          }
          if (csData) {
            appealsTrendFormattedData['C&S'] = csData;
          }
          if (eiData) {
            appealsTrendFormattedData['E&I'] = eiData;
          }
          if (other) {
            appealsTrendFormattedData['Other'] = other;
          }

          resolve(appealsTrendFormattedData);
        },
        err => {
          console.log('Advocate Page , Error for appeals trend cards', err);
        }
      );
    });
  }

  public getTotalCallsShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.callsData(...parameters).subscribe(
        callsTotalData => {
          resolve(callsTotalData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
        }
      );
    });
  }

  public getTotalCallsTrendLineShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.callsTrendLineData(...parameters).subscribe(
        callsTrendData => {
          const beData = [];
          const claimsData = [];
          const paData = [];
          const other = [];

          if (callsTrendData[0]) {
            callsTrendData[0].forEach(element => {
              if (element.CallVolByQuesType.BenefitsEligibility) {
                this.collectiveBeData = element.CallVolByQuesType.BenefitsEligibility;
              }
              if (element.CallVolByQuesType.Claims) {
                this.collectiveClaimsData = element.CallVolByQuesType.Claims;
              }
              if (element.CallVolByQuesType.PriorAuth) {
                this.collectivePaData = element.CallVolByQuesType.PriorAuth;
              }
              if (element.CallVolByQuesType.Others) {
                this.collectiveOtherData = element.CallVolByQuesType.Others;
              }

              const trendTimePeriod = element.Calldate;
              if (param.timePeriod === 'Last3Months' || param.timePeriod === 'Last30Days') {
                this.monthName = this.common
                  .dateFormat(trendTimePeriod)
                  .substr(0, 6)
                  .replace('T', '');
              } else {
                this.monthName = this.common.dateFormat(trendTimePeriod).substr(0, 3);
              }
              beData.push({
                name: this.monthName,
                value: this.collectiveBeData,
                month: trendTimePeriod
              });
              claimsData.push({
                name: this.monthName,
                value: this.collectiveClaimsData,
                month: trendTimePeriod
              });
              paData.push({
                name: this.monthName,
                value: this.collectivePaData,
                month: trendTimePeriod
              });
              other.push({
                name: this.monthName,
                value: this.collectiveOtherData,
                month: trendTimePeriod
              });
            });
          }

          beData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          claimsData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          paData.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });

          other.sort(function(a, b) {
            let dateA: any;
            dateA = new Date(a.month);
            let dateB: any;
            dateB = new Date(b.month);
            return dateA - dateB; // sort by date ascending
          });
          const callsTrendFormattedData = {};
          if (beData) {
            callsTrendFormattedData['B&E'] = beData;
          } else {
            callsTrendFormattedData['B&E'] = null;
          }
          if (claimsData) {
            callsTrendFormattedData['CLAIMS'] = claimsData;
          } else {
            callsTrendFormattedData['CLAIMS'] = null;
          }
          if (paData) {
            callsTrendFormattedData['P&A'] = paData;
          } else {
            callsTrendFormattedData['P&A'] = null;
          }
          if (other) {
            callsTrendFormattedData['Other'] = other;
          } else {
            callsTrendFormattedData['Other'] = null;
          }
          resolve(callsTrendFormattedData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
        }
      );
    });
  }

  public paymentsBySubmission(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    return new Promise((resolve, reject) => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.paymentsBySubmission(...parameters).subscribe(
        pbsData => {
          const getData = pbsData[0];
          if (getData == null) {
            //  return reject(null);
            this.sendData = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: 'Payments by Submission',
              data: null,
              timeperiod: null
            };
          } else {
            this.sendData = {
              id: 'paymentSubmission',
              category: 'app-card',
              type: 'stackBarChart',
              title: 'Payments by Submission',
              data: {
                graphValues: [
                  {
                    name: '',
                    ...this.setGraphValues(getData, param['viewClaimsByFilter'])
                  }
                ],
                color: ['#3381FF', '#00B8CC'],
                gdata: ['card-inner', 'paymentBySubmission'],
                sdata: null
              },
              status: null,
              timeperiod: this.setTimePeriodValue(getData, param['viewClaimsByFilter'])
            };
          }
          resolve(this.sendData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
          // reject();
        }
      );
    });
  }

  /**
   * Set Graph Value Object for DOS and DOP Claims
   * @param resObj Parsed response object
   * @param claimsBy View Claims By Filter Value
   */
  setGraphValues(resObj, claimsBy) {
    if (claimsBy === 'DOP') {
      return {
        electronic: resObj.EDISubmissions.ALL.ClaimFinancialMetrics.ApprovedAmount,
        paper: resObj.PaperSubmissions.ALL.ClaimFinancialMetrics.ApprovedAmount
      };
    }
    return {
      electronic: resObj.EDISubmissions.All.ClaimsLobSummary[0].AmountPaid,
      paper: resObj.PaperSubmissions.All.ClaimsLobSummary[0].AmountPaid
    };
  }

  /**
   * Set Time Period string Value for DOS and DOP Claims
   * @param resObj Parsed response object
   * @param claimsBy View Claims By Filter Value
   */
  setTimePeriodValue(resObj, claimsBy) {
    if (claimsBy === 'DOP') {
      return this.common.dateFormat(resObj.StartDate) + '&ndash;' + this.common.dateFormat(resObj.EndDate);
    }
    return (
      this.common.dateFormat(resObj.PaperSubmissions.Startdate) +
      '&ndash;' +
      this.common.dateFormat(resObj.PaperSubmissions.Enddate)
    );
  }
}
