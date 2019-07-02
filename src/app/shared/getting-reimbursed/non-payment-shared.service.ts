import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { NonPaymentService } from './../../rest/getting-reimbursed/non-payment.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class NonPaymentSharedService {
  public providerKey;
  public summaryData: Array<object> = [];
  constructor(
    private nonPaymentService: NonPaymentService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}
  public getNonPayment() {
    this.providerKey = this.session.providerKeyData();

    return new Promise(resolve => {
      const parameters = [this.providerKey, 'NONPAYMENT_METRICS'];
      // let nonPayment: object;

      this.nonPaymentService.getNonPaymentData(...parameters).subscribe(
        ([nonPaymentData1]) => {
          this.summaryData = nonPaymentData1;
          console.log('Shared Non Payment', nonPaymentData1);
          resolve(this.summaryData);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
