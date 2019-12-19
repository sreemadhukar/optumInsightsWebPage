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
          if (callsTrendData) {
            callsTrendData.forEach(element => {
              console.log('collective', element);
              console.log('collectiveBeData1', element.CallTalkTimeByQuesType.BenefitsEligibility);
              const collectiveBeData = [];
              const collectiveClaimsData = [];
              const collectivePaData = [];
              const collectiveOtherData = [];

              if (element.CallTalkTimeByQuesType.BenefitsEligibility) {
                collectiveBeData.push(element.CallTalkTimeByQuesType.BenefitsEligibility);
                console.log('collectiveBeData2', collectiveBeData);
              }
              if (element.CallTalkTimeByQuesType.Claims) {
                collectiveClaimsData.push(element.CallTalkTimeByQuesType.Claims);
              }
              if (element.CallTalkTimeByQuesType.PriorAuth) {
                collectivePaData.push(element.CallTalkTimeByQuesType.PriorAuth);
              }
              if (element.CallTalkTimeByQuesType.Others) {
                collectiveOtherData.push(element.CallTalkTimeByQuesType.Others);
              }

              if (collectiveBeData.length !== 0) {
                for (let i = 0; i < collectiveBeData.length; i++) {
                  const trendCollectiveValue = collectiveBeData[i];
                  const trendTimePeriod = element.Calldate;
                  // const monthName = trendTimePeriod.substr(4, 4);

                  beData.push({
                    // name: monthName,
                    value: trendCollectiveValue,
                    month: trendTimePeriod
                  });
                }
              }
            });
          }
          const callsTrendFormattedData = {};
          if (beData) {
            callsTrendFormattedData['B&E'] = beData;
          }
          console.log('callsTrendFormattedData', callsTrendFormattedData);
          resolve(callsTrendFormattedData);
        },
        err => {
          console.log('Advocate Page , Error for calls card', err);
        }
      );
    });
  }
}
