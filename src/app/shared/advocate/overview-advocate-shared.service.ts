import { Injectable } from '@angular/core';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { OverviewAdvocateService } from '../../rest/advocate/overview-advocate.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import * as _ from 'lodash';
import { OverviewAdvocate } from 'src/app/modals/title-config';

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
          if (appealsLeftData && (appealsLeftData.status === 200 || appealsLeftData.StatusCode === 200)) {
            resolve(appealsLeftData);
          } else {
            resolve(null);
          }
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
    return new Promise((resolve, reject) => {
      const parameters = this.getParameterCategories(param);

      this.overviewAdvocateService
        .callsData(...parameters)
        .subscribe(callsTotalData => resolve(callsTotalData), err => reject(err));
    });
  }

  public getTotalCallsTrendLineShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.callsTrendLineData(...parameters).subscribe(
        response => {
          if (_.get(response, 'Data') === null) {
            resolve(null);
          }
          const sendData = {};
          const sortedData = _.clone(response.Data);
          sortedData.sort(function(a, b) {
            return a.Calldate.split('T')[0].replace(/-/g, '') - b.Calldate.split('T')[0].replace(/-/g, ''); // sort by date ascending
          });
          const monthData = sortedData.map(item => {
            const trendTimePeriod = _.get(item, 'Calldate', '');
            if (param.timePeriod === 'Last3Months' || param.timePeriod === 'Last30Days') {
              return this.common
                .dateFormat(trendTimePeriod)
                .substr(0, 6)
                .replace('T', '');
            }
            return this.common.dateFormat(trendTimePeriod).substr(0, 3);
          });
          const formatData = (index, value) => {
            return {
              name: monthData[index],
              value: value
            };
          };

          sendData['B&E'] = sortedData.map((item, index) =>
            formatData(index, _.get(item, 'CallVolByQuesType.BenefitsEligibility', ''))
          );
          sendData['CLAIMS'] = sortedData.map((item, index) =>
            formatData(index, _.get(item, 'CallVolByQuesType.Claims', ''))
          );
          sendData['P&A'] = sortedData.map((item, index) =>
            formatData(index, _.get(item, 'CallVolByQuesType.PriorAuth', ''))
          );
          sendData['Other'] = sortedData.map((item, index) =>
            formatData(index, _.get(item, 'CallVolByQuesType.Others', ''))
          );
          resolve(sendData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
          resolve(null);
        }
      );
    });
  }

  public paymentsBySubmission(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.overviewAdvocateService.paymentsBySubmission(...parameters).subscribe(
        getData => {
          if (
            getData === null ||
            !getData ||
            !getData.EDISubmissions ||
            !getData.PaperSubmissions ||
            (getData['error'] && getData['status'] != null) ||
            (_.get(getData, ['EDISubmissions', 'All']) === null && _.get(getData, ['PaperSubmissions', 'All']) == null)
          ) {
            this.sendData = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: OverviewAdvocate.paymentBySubissionTitle,
              data: null,
              timeperiod: null
            };

            return resolve(this.sendData);
          } else {
            this.sendData = {
              id: 'paymentSubmission',
              category: 'app-card',
              type: 'stackBarChart',
              title: OverviewAdvocate.paymentBySubissionTitle,
              MetricID: this.MetricidService.MetricIDs.PaymentsBySubmission,
              data: {
                graphValues: [
                  {
                    name: '',
                    ...this.setGraphValues(getData, param['viewClaimsByFilter'])
                  }
                ],
                color: ['#3381FF', '#00B8CC'],
                gdata: ['card-inner', 'paymentBySubmission']
              },
              status: null,
              timeperiod: this.setTimePeriodValue(getData, param['viewClaimsByFilter'])
            };
          }
          const checkResponse = { ...this.setGraphValues(getData, param['viewClaimsByFilter']) };

          if (!checkResponse['electronic'] && !checkResponse['paper']) {
            this.sendData = {
              category: 'app-card',
              type: 'donutWithLabel',
              status: 404,
              title: OverviewAdvocate.paymentBySubissionTitle,
              data: null,
              timeperiod: null
            };

            resolve(this.sendData);
          }
          resolve(this.sendData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
        }
      );
    });
  }

  /**
   * Set Graph Value Object for DOS and DOP Claims
   * @param resObj Parsed response object
   * @param claimsBy View Claims By Filter Value
   */
  setGraphValues(resObj, claimsBy): Object {
    if (claimsBy === 'DOP') {
      return {
        electronic:
          resObj.EDISubmissions && resObj.EDISubmissions.ALL
            ? resObj.EDISubmissions.ALL.ClaimFinancialMetrics.ApprovedAmount
            : 0,
        paper:
          resObj.PaperSubmissions && resObj.PaperSubmissions.ALL
            ? resObj.PaperSubmissions.ALL.ClaimFinancialMetrics.ApprovedAmount
            : 0
      };
    }
    return {
      electronic:
        resObj.EDISubmissions && resObj.EDISubmissions.All
          ? resObj.EDISubmissions.All.ClaimsLobSummary[0].AmountPaid
          : 0,
      paper:
        resObj.PaperSubmissions && resObj.PaperSubmissions.All
          ? resObj.PaperSubmissions.All.ClaimsLobSummary[0].AmountPaid
          : 0
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
    const startDate = resObj.PaperSubmissions.Startdate
      ? resObj.PaperSubmissions.Startdate
      : resObj.EDISubmissions.Startdate;
    const endDate = resObj.PaperSubmissions.Enddate ? resObj.PaperSubmissions.Enddate : resObj.EDISubmissions.Enddate;
    return this.common.dateFormat(startDate) + '&ndash;' + this.common.dateFormat(endDate);
  }
}
