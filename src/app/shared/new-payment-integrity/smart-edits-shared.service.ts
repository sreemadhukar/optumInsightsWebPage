import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from './../../shared/common-utils.service';
import { SmartEditsService } from '../../rest/new-payment-integrity/smart-edits.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import { GlossaryMetricidService } from '../../shared/glossary-metricid.service';
// import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsSharedService {
  public timeFrame;
  public providerKey;

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
    return new Promise((resolve, reject) => {
      const parameters = this.getParameterCategories(param);

      this.smartEditsService.smartEditReturned(parameters).subscribe(
        smartEditsData => resolve(smartEditsData),
        err => reject(err)
      );
    });
  }
  // public getSmartEditSharedTopReasons() {
  //   this.smartEditsService.getSmartEditTopReasons().subscribe(data => {
  //     console.log('shared', data);
  //   });
  // }
  public getSmartEditSharedTopReasons() {
    const reason = [];
    return new Promise(resolve => {
      this.smartEditsService.getSmartEditTopReasons().subscribe(smartEditReasonData => {
        const topReasonsData = smartEditReasonData;

        const ReasonsData = topReasonsData.Data;

        if (topReasonsData !== null) {
          if (topReasonsData == null && topReasonsData.hasOwnProperty('Status')) {
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
                graphValues: [reasonsPercentageVal1[i], reasonsPercentageVal2[i]],
                barText1: reasonsCode[i],
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
