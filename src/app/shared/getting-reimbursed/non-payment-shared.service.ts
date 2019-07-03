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
  public timeFrame: string;
  constructor(
    private nonPaymentService: NonPaymentService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}
  public getNonPayment() {
    this.providerKey = this.session.providerKeyData();
    this.timeFrame = 'Last 6 Months';
    return new Promise(resolve => {
      const parameters = [this.providerKey, 'NONPAYMENT_METRICS'];
      // let nonPayment: object;

      this.nonPaymentService.getNonPaymentData(...parameters).subscribe(
        ([nonPaymentData1]) => {
          let claimsNotPaid: Object;
          let claimsNotPaidRate: Object;
          if (
            nonPaymentData1.hasOwnProperty('All') &&
            nonPaymentData1.All != null &&
            nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
            nonPaymentData1.All.ClaimsLobSummary.length &&
            nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
            nonPaymentData1.hasOwnProperty('Cs') &&
            nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
            nonPaymentData1.Cs.ClaimsLobSummary.length &&
            nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
            nonPaymentData1.hasOwnProperty('Ei') &&
            nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
            nonPaymentData1.Ei.ClaimsLobSummary.length &&
            nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
            nonPaymentData1.hasOwnProperty('Mr') &&
            nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
            nonPaymentData1.Mr.ClaimsLobSummary.length &&
            nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
          ) {
            const nonPaidData = [
              nonPaymentData1.Mr.ClaimsLobSummary[0].ClaimsDenied,
              nonPaymentData1.Cs.ClaimsLobSummary[0].ClaimsDenied,
              nonPaymentData1.Ei.ClaimsLobSummary[0].ClaimsDenied
            ];
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Claims Not Paid',
              data: {
                graphValues: nonPaidData,
                centerNumber:
                  this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied) < 1 &&
                  this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied) > 0
                    ? '< $1'
                    : '$' + this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied),
                color: ['#3381FF', '#80B0FF', '#003DA1'],
                gdata: ['card-inner', 'claimsNotPaid'],
                sdata: {
                  sign: 'down',
                  data: '-10.2%'
                },
                labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                hover: true
              },
              besideData: {
                labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
                color: ['#3381FF', '#80B0FF', '#003DA1']
              },
              timeperiod: this.timeFrame
            };
          } else {
            claimsNotPaid = {
              category: 'app-card',
              type: 'donutWithLabel',
              title: null,
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
          }
          if (
            nonPaymentData1.hasOwnProperty('All') &&
            nonPaymentData1.All != null &&
            nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
            nonPaymentData1.All.ClaimsLobSummary.length &&
            nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
            nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
          ) {
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              title: 'Claims Non-Payment Rate',
              data: {
                graphValues: [
                  nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate,
                  nonPaymentData1.All.ClaimsLobSummary[0].ClaimsYieldRate
                ],
                centerNumber:
                  nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                  nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                    ? '< 1%'
                    : nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                color: ['#3381FF', '#D7DCE1'],
                gdata: ['card-inner', 'claimsNonPaymentRate'],
                sdata: {
                  sign: 'up',
                  data: '+3.7%'
                }
              },
              timeperiod: this.timeFrame
            };
          } else {
            claimsNotPaidRate = {
              category: 'app-card',
              type: 'donut',
              title: null,
              data: null,
              timeperiod: null
            };
          } // end if else
          this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
          resolve(this.summaryData);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
