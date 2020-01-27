import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../../components/getting-reimbursed-page/getting-reimbursed.module';
import { CommonUtilsService } from '../../common-utils.service';
import { SessionService } from '../../session.service';
import { AuthorizationService } from '../../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../../glossary-metricid.service';
import { AdvocateModule } from '../../../components/advocate/advocate.module';
import { HttpParams } from '@angular/common/http';
import { GettingReimbursedPayload } from '../payload.class';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { NonPaymentTopClaimsService } from './../../../rest/getting-reimbursed/non-payment-top-claims.service';
@Injectable({
  providedIn: 'root'
})
export class TopClaimsSharedService {
  public filterParameters: any;
  public providerKey: number;

  constructor(
    private nonPaymentTopClaimsService: NonPaymentTopClaimsService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}
  public getClaimsData(filterParameters) {
    this.providerKey = this.session.providerKeyData();
    const TIN = filterParameters.taxId;
    console.log('TIN', filterParameters);
    const periodStartDate = '2020-01-01';
    const periodEndDate = '2020-01-01';
    const requestBody = {
      tins: ['020610912', '386005601'],
      periodStart: '2020-01-01',
      periodEnd: '2020-01-01',
      reason: 'COB Need Further Action',
      subReason: 'EOB/Proof No COB',
      taxIdOwnership: 'OWNED',
      requestType: 'DOS'
    };
    return new Promise(resolve => {
      this.nonPaymentTopClaimsService.getViewTopClaimsData([this.providerKey], requestBody).subscribe(data => {
        console.log('line 71', data);
        if ((data || {}).ClaimsNonPaymentMetrics) {
          const claimsData = data;
          console.log('claimsData', claimsData);
          resolve(claimsData);
        }
      });
    });
  }
}
