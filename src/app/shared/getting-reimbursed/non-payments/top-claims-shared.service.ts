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

    const TIN = filterParameters.taxId[0].Tin;

    const timePeriod = filterParameters.timePeriod;

    const viewClaimsByFilter = filterParameters.viewClaimsByFilter;

    let specificTin;
    //  if (TIN === 'All') {
    //   alert(specificTin);
    //    specificTin = null;
    //  } else {

    //    if (filterParameters.taxId.length === 1) {
    //     alert('tin1');
    //      specificTin = filterParameters.taxId;
    //    } else {
    //     alert('tin2');
    //      const taxArray = filterParameters.taxId;

    //      specificTin = taxArray;
    //        }
    //  }
    if (TIN === 'All') {
      specificTin = null;
    } else {
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
    const viewClaimTypeValue = viewClaimsByFilter;

    const requestBody = {
      tins: specificTin,
      timeFilter: timePeriod,
      timeFilterText: null,
      reason: 'COB Need Further Action',
      subReason: 'EOB/Proof No COB',
      taxIdOwnership: 'OWNED',
      requestType: viewClaimTypeValue
    };
    return new Promise(resolve => {
      this.nonPaymentTopClaimsService.getViewTopClaimsData([this.providerKey], requestBody).subscribe(data => {
        console.log('data', data);

        const claimsData = data.ClaimsNonPaymentMetrics;
        console.log('data', claimsData);
        resolve(claimsData);
      });
    });
  }
}
