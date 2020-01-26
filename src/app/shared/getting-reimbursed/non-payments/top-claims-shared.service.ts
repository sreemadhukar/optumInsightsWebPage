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
  private providerKey: number;
  constructor(
    private nonPaymentTopClaimsService: NonPaymentTopClaimsService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}
  public getClaimsData(filterParameters) {
    this.providerKey = this.session.providerKeyData();
    // Save Parameters from Filter Session
    const TIN = filterParameters.taxId[0];
    const reasonData = filterParameters.reasonData;
    const viewClaimsByFilter = filterParameters.viewClaimsByFilter;
    // TIN
    let isAllTinBool;
    let specificTin;
    if (TIN === 'All') {
      isAllTinBool = true;
      specificTin = null;
    } else {
      isAllTinBool = false;
      if (filterParameters.taxId.length === 1) {
        specificTin = parseInt(TIN.replace(/\D/g, ''), 10).toString();
      } else {
        const taxArray = filterParameters.taxId;
        const taxArrayFormatted = [];
        for (let i = 0; i < taxArray.length; i++) {
          taxArrayFormatted.push(parseInt(taxArray[i].replace(/\D/g, ''), 10));
        }
        specificTin = taxArrayFormatted.join(', ');
      }
    }
    // DOS and DOP
    let viewClaimTypeValue;
    if (viewClaimsByFilter === 'DOP') {
      viewClaimTypeValue = 'Date of Processing';
    } else if (viewClaimsByFilter === 'DOS') {
      viewClaimTypeValue = 'Date of Service';
    }
    const periodStartDate = '2020-01-01';
    const periodEndDate = '2020-01-01';
    const requestBody = {
      tins: specificTin,
      periodStart: periodStartDate,
      periodEnd: periodEndDate,
      reason: 'COB Need Further Action',
      subReason: 'EOB/Proof No COB',
      taxIdOwnership: 'OWNED',
      requestType: viewClaimTypeValue
    };
    return new Promise((resolve, reject) => {
      this.nonPaymentTopClaimsService.getViewTopClaimsData([this.providerKey], requestBody).subscribe(data => {
        if ((data || {}).ClaimsNonPaymentMetrics) {
          const claimsData = data;
          console.log('claimsData', claimsData);
          resolve(claimsData);
        }
      });
    });
  }
}
