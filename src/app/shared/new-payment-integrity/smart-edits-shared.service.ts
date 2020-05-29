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

          let lessThan5Width = 4;
          let greaterThan5Width = 4;

          if (this.repairedResubmittedData[0] > this.repairedResubmittedData[1]) {
            lessThan5Width = 382;
            if (this.repairedResubmittedData[1] !== 0) {
              greaterThan5Width = (this.repairedResubmittedData[1] * 382) / this.repairedResubmittedData[0];
            }
          } else {
            greaterThan5Width = 382;
            if (this.repairedResubmittedData[0] !== 0) {
              lessThan5Width = (this.repairedResubmittedData[0] * 382) / this.repairedResubmittedData[1];
            }
          }
          this.repairedResubmittedData[2] = lessThan5Width;
          this.repairedResubmittedData[3] = greaterThan5Width;
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
  // public getSmartEditSharedTopReasons() {
  //   this.smartEditsService.getSmartEditTopReasons().subscribe(data => {
  //     console.log('shared', data);
  //   });
  // }

  public getSmartEditSharedTopReasons(param) {
    const reason = [];
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';

    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      this.smartEditsService.getSmartEditTopReasons(parameters).subscribe(smartEditReasonData => {
        const topReasonsData = smartEditReasonData;
        const ReasonsData = topReasonsData.Data;
        if (topReasonsData !== null) {
          if (ReasonsData == null && topReasonsData.hasOwnProperty('Status')) {
            reason.push({
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Top Claims Appeals Overturn Reasons',
              MetricID: this.MetricidService.MetricIDs.TopClaimSmartEditOverturnReasons,
              data: null,
              timeperiod: null
            });
          } else {
            const reasonsCode = [{}];
            const reasonsPercentageVal1 = [{}];
            const reasonsDesc = [{}];
            const reasonsPercentageVal2 = [{}];
            const barVal = [{}];

            for (let a = 0; a < ReasonsData.Reasons.length; a++) {
              reasonsCode[a] = ReasonsData.Reasons[a].Code;
              reasonsDesc[a] = ReasonsData.Reasons[a].Description;
              reasonsPercentageVal1[a] = ReasonsData.Reasons[a].Percentage;
              reasonsPercentageVal2[a] = 100 - Number(reasonsPercentageVal1[a]);
              barVal[a] = reasonsPercentageVal1[a] + '%';
            }

            for (let i = 0; i < ReasonsData.Reasons.length; i++) {
              reason.push({
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
          }
        } // null
      });
      const r = reason;
      resolve(r);
    }); // promise
  } // function end
}
