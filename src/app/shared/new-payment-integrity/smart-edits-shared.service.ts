import { Injectable } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from './../../shared/common-utils.service';
import { SmartEditsService } from '../../rest/new-payment-integrity/smart-edits.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SmartEditsSharedService {
  public timeFrame;
  public providerKey;
  public smartEditClaimsReturned;
  public lob;

  constructor(
    private common: CommonUtilsService,
    private session: SessionService,
    private smartEditsService: SmartEditsService
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
        if (smartEditsData != null && smartEditsData != undefined) {
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
            timeperiod: this.session.filterObjValue.timeFrame,
            title: 'Smart Edits Claims Returned',
            toggle: true,
            type: 'donutWithLabel',
            besideData: {
              labels: ['Repaired & Resubmitted', 'Resubmitted Without Changes', 'No Action Taken'],
              color: ['#3381FF', '#80B0FF', '#003DA1']
            }
          };
          resolve(this.smartEditClaimsReturned);
        }
      });
    });
  }
}
