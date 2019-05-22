import { Injectable } from '@angular/core';
import { PriorAuthService } from '../../rest/prior-auth/prior-auth.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: CareDeliveryPageModule
})
export class PriorAuthSharedService {
  private priorAuthData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;

  constructor(
    private priorAuthService: PriorAuthService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}

  public getPriorAuthData() {
    this.providerKey = this.session.providerKey();
    this.priorAuthData = [];
    return new Promise(resolve => {
      let parameters;
      let newParameters;
      /*
      let PAApprovedCount;
      let PANotApprovedCount;
      let PANotPendingCount;
      let PANotCancelledCount;
      let PARequestedCount;
      let PAApprovalRate;
      let StandardTATConversion;
      let UrgentTATConversion;
      */
      const tempArray: Array<object> = [];
      parameters = [this.providerKey, true];

      newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];
      const timeRange = 'rolling12';
      const isAllTin = true;
      const isAlllob = true;
      const isAllSS = true;

      this.priorAuthService
        .getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters)
        .subscribe(providerSystems => {
          this.priorAuthData.push(providerSystems);
          resolve(this.priorAuthData);
        });
    });
  }
}
