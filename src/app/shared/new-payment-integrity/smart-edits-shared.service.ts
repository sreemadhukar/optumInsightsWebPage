import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from './../../shared/common-utils.service';
import { SmartEditsService } from '../../rest/new-payment-integrity/smart-edits.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import { GlossaryMetricidService } from '../../shared/glossary-metricid.service';
// import * as _ from 'lodash';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsSharedService {
  public timeFrame;
  public providerKey;
  public smartEditClaimsReturned;
  public lob;
  public repairedResubmittedData: any;

  constructor(
    private common: CommonUtilsService,
    private session: SessionService,
    private smartEditsService: SmartEditsService,
    private MetricidService: GlossaryMetricidService
  ) {}

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  public getSmartEditsReturnedShared(param) {
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.smartEditReturned(parameters).subscribe(smartEditsData => {
        if (smartEditsData != null && smartEditsData != undefined && smartEditsData.Data != null) {
          const totalReturned =
            smartEditsData.Data.All.RepairedResubmitted +
            smartEditsData.Data.All.ResubmittedWithoutChanges +
            smartEditsData.Data.All.NoActionTaken;
          this.smartEditClaimsReturned = {
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
            // timeperiod: this.session.filterObjValue.timeFrame,
            timeperiod:
              this.common.dateFormat(smartEditsData.Data.PeriodStart) +
              '&ndash;' +
              this.common.dateFormat(smartEditsData.Data.PeriodEnd),
            title: 'Smart Edits Claims Returned',
            toggle: true,
            type: 'donutWithLabel',
            besideData: {
              labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken'],
              color: ['#3381FF', '#80B0FF', '#003DA1']
            }
          };
          resolve(this.smartEditClaimsReturned);
        } else {
          this.smartEditClaimsReturned = {
            category: 'app-card',
            type: 'donutWithLabel',
            status: 404,
            title: 'Smart Edits Claims Returned',
            data: null,
            timeperiod: null
          };
        }
        resolve(this.smartEditClaimsReturned);
      });
    });
  }

  public getSmartEditsRepairedResubmittedShared(param) {
    this.repairedResubmittedData = [];
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.smartEditReturned(parameters).subscribe(smartEditsData => {
        if (smartEditsData != null && smartEditsData != undefined && smartEditsData.Data != null) {
          this.repairedResubmittedData[0] = smartEditsData.Data.All.ResubmittedTimeLessThanEqualToFiveDays;
          this.repairedResubmittedData[1] = smartEditsData.Data.All.ResubmittedTimeGreaterThanFiveDays;

          const widthMap = this.widthFunctionForRepairBars(
            this.repairedResubmittedData[0],
            this.repairedResubmittedData[1]
          );
          this.repairedResubmittedData[2] = widthMap[0];
          this.repairedResubmittedData[3] = widthMap[1];
          resolve(this.repairedResubmittedData);
        } else {
          this.repairedResubmittedData = {
            category: 'app-card',
            type: 'donutWithLabel',
            status: 404,
            title: 'Smart Edits Repaired & Resubmitted Response Time',
            data: null,
            timeperiod: null
          };
          resolve(this.repairedResubmittedData);
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
    const reason = [];
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';

    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.getSmartEditTopReasons(parameters).subscribe(smartEditReasonData => {
        if (smartEditReasonData != null && smartEditReasonData.Data != null) {
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
          for (let i = 0; i < smartEditReasonData.Data.Reasons.length; i++) {
            reason.push({
              type: 'bar chart',
              cdata: 'smartedit',
              graphValues: [reasonsPercentageVal1[i], reasonsPercentageVal2[i]],
              barText: reasonsCode[i] + ' - ' + reasonsDesc[i],
              barDescp: reasonsDesc[i],
              barValue: [barVal[i]],
              color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
              gdata: ['app-card-structure', 'smartEditClaimsOverturnReason' + i],
              timeperiod:
                this.common.dateFormat(smartEditReasonData.Data.PeriodStart) +
                '&ndash;' +
                this.common.dateFormat(smartEditReasonData.Data.PeriodEnd)
            });
          }
        } else {
          reason.push({
            category: 'app-card',
            type: 'donut',
            status: 404,
            title: 'Smart Edits Returned Claims Top Reasons',
            MetricID: this.MetricidService.MetricIDs.TopClaimSmartEditOverturnReasons,
            data: null,
            timeperiod: null
          });
        } // promise
        const r = reason;
        resolve(r);
      }); // function end
    });
  }
}
