import { Injectable } from '@angular/core';
import { SessionService } from '../../shared/session.service';
import { CommonUtilsService } from './../../shared/common-utils.service';
import { SmartEditsService } from '../../rest/new-payment-integrity/smart-edits.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import { GlossaryMetricidService } from '../../shared/glossary-metricid.service';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsSharedService {
  constructor(
    private readonly common: CommonUtilsService,
    private readonly session: SessionService,
    private readonly smartEditsService: SmartEditsService,
    private readonly MetricidService: GlossaryMetricidService
  ) {}

  getParameterCategories(param) {
    let parameters = [];
    const providerKey = this.session.providerKeyData();
    parameters = [providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  public getSmartEditsReturnedShared(param) {
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.smartEditReturned(parameters).subscribe(smartEditsData => {
        let smartEditClaimsReturned = {};
        if (smartEditsData !== null && smartEditsData !== undefined && smartEditsData.Data !== null) {
          const totalReturned =
            smartEditsData.Data.All.RepairedResubmitted +
            smartEditsData.Data.All.ResubmittedWithoutChanges +
            smartEditsData.Data.All.NoActionTaken;
          smartEditClaimsReturned = {
            category: 'app-card',
            data: {
              centerNumber: totalReturned,
              color: ['#3381FF', '#80B0FF', '#003DA1'],
              gdata: ['card-inner', 'smartEditsClaimsReturned'],
              graphValues: [
                smartEditsData.Data.All.RepairedResubmitted,
                smartEditsData.Data.All.ResubmittedWithoutChanges,
                smartEditsData.Data.All.NoActionTaken
              ],
              cdata: 'smartEditsReturnedShared',
              hover: true,
              labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken']
            },
            timeperiod:
              this.common.dateFormat(smartEditsData.Data.PeriodStart) +
              '&ndash;' +
              this.common.dateFormat(smartEditsData.Data.PeriodEnd),
            title: 'Smart Edits Claims Returned',
            toggle: true,
            type: 'donutWithLabel',
            MetricID: this.MetricidService.MetricIDs.SmartEditsReturned,
            besideData: {
              labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken'],
              color: ['#3381FF', '#80B0FF', '#003DA1']
            }
          };
          resolve(smartEditClaimsReturned);
        } else {
          smartEditClaimsReturned = {
            category: 'app-card',
            type: 'donutWithLabel',
            status: 404,
            title: 'Smart Edits Claims Returned',
            data: null,
            timeperiod: null
          };
        }
        resolve(smartEditClaimsReturned);
      });
    });
  }

  public getSmartEditsRepairedResubmittedShared(param) {
    const repairedResubmittedData: any = [];
    const result = {
      category: 'app-card',
      status: null,
      title: 'Smart Edits Repaired & Resubmitted Response Time',
      data: null,
      MetricID: this.MetricidService.MetricIDs.SmartEditsResubmitted,
      timeperiod: null
    };
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.smartEditReturned(parameters).subscribe(smartEditsData => {
        if (smartEditsData !== null && smartEditsData !== undefined && smartEditsData.Data !== null) {
          repairedResubmittedData[0] = smartEditsData.Data.All.ResubmittedTimeLessThanEqualToFiveDays;
          repairedResubmittedData[1] = smartEditsData.Data.All.ResubmittedTimeGreaterThanFiveDays;

          const widthMap = this.widthFunctionForRepairBars(repairedResubmittedData[0], repairedResubmittedData[1]);
          repairedResubmittedData[2] = widthMap[0];
          repairedResubmittedData[3] = widthMap[1];

          const maxValue = Math.max(repairedResubmittedData[2], repairedResubmittedData[3]);

          const lessThan5DaysBarData = {};
          lessThan5DaysBarData['id'] = 'lessThan5';
          lessThan5DaysBarData['height'] = '48px';
          lessThan5DaysBarData['title'] = 'Less Than 5 Days';
          lessThan5DaysBarData['numeric'] = repairedResubmittedData[2];
          lessThan5DaysBarData['maxValue'] = maxValue;
          lessThan5DaysBarData['color'] = '#3381ff';

          const greaterThan5DaysBarData = {};
          greaterThan5DaysBarData['id'] = 'greaterThan5';
          greaterThan5DaysBarData['height'] = '48px';
          greaterThan5DaysBarData['title'] = 'Greater Than 5 Days';
          greaterThan5DaysBarData['numeric'] = repairedResubmittedData[3];
          greaterThan5DaysBarData['maxValue'] = maxValue;
          greaterThan5DaysBarData['color'] = '#fc6431';
          result.data = { content: repairedResubmittedData, list: [lessThan5DaysBarData, greaterThan5DaysBarData] };
          result.timeperiod = this.getTimePeriod(smartEditsData.Data);

          resolve(result);
        } else {
          result.status = 404;
          resolve(result);
        }
      });
    });
  }

  widthFunctionForRepairBars(a, b) {
    const widthMap = [];
    let lessThan5Width = 4;
    let greaterThan5Width = 4;

    if (a > b) {
      lessThan5Width = 342;
      if (b !== 0) {
        greaterThan5Width = (b * 342) / a;
      }
    } else {
      greaterThan5Width = 342;
      if (a !== 0) {
        lessThan5Width = (a * 342) / b;
      }
    }
    widthMap.push(lessThan5Width);
    widthMap.push(greaterThan5Width);
    return widthMap;
  }

  public getSmartEditSharedTopReasons(param) {
    const result = {
      category: 'app-card',
      title: 'Smart Edits Returned Claims Top Reasons',
      MetricID: this.MetricidService.MetricIDs.SmartEditsReturnedReasons,
      data: [],
      timeperiod: null,
      status: null
    };

    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.getSmartEditTopReasons(parameters).subscribe(smartEditReasonData => {
        if (smartEditReasonData !== null && smartEditReasonData.Data != null) {
          const reasonsCode = [{}];
          const reasonsPercentageVal1 = [{}];
          const reasonsDesc = [{}];
          const reasonsPercentageVal2 = [{}];
          const barVal = [{}];

          for (let a = 0; a < smartEditReasonData.Data.Reasons.length; a++) {
            reasonsCode[a] = smartEditReasonData.Data.Reasons[a].Code;
            reasonsDesc[a] = smartEditReasonData.Data.Reasons[a].Description;
            reasonsPercentageVal1[a] = smartEditReasonData.Data.Reasons[a].Percentage;
            reasonsPercentageVal2[a] = 100 - Number(reasonsPercentageVal1[a]);
            barVal[a] = reasonsPercentageVal1[a] + '%';
          }
          const reasons = [];
          for (let i = 0; i < smartEditReasonData.Data.Reasons.length; i++) {
            reasons.push({
              type: 'bar chart',
              cdata: 'smartedit',
              graphValues: [reasonsPercentageVal1[i], reasonsPercentageVal2[i]],
              barText: reasonsCode[i] + ' - ' + reasonsDesc[i],
              barDescp: reasonsDesc[i],
              barValue: [barVal[i]],
              color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
              gdata: ['app-card-structure', 'smartEditClaimsOverturnReason' + i]
            });
          }
          result.data = reasons;
          result.timeperiod = this.getTimePeriod(smartEditReasonData.Data);
        } else {
          result.status = 404;
        }
        resolve(result);
      });
    });
  }

  private getTimePeriod(dataObject: any) {
    const { PeriodStart = new Date(), PeriodEnd = new Date() } = dataObject;
    return this.common.dateFormat(PeriodStart) + '&ndash;' + this.common.dateFormat(PeriodEnd);
  }
}
