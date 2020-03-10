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
  clickSubReason: any;
  public filterParameters: any;
  public providerKey: number;
  public specificTin: any;

  constructor(
    private nonPaymentTopClaimsService: NonPaymentTopClaimsService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}
  public getClaimsData(filterParameters, reasonSelected, subReason) {
    this.providerKey = this.session.providerKeyData();

    const timePeriod = this.getParameterviewTopsClaims(filterParameters)[0].TimeFilter;
    const viewClaimsByFilter = filterParameters.viewClaimsByFilter;

    // DOS and DOP
    const viewClaimTypeValue = viewClaimsByFilter;

    let specificTin = this.getParameterviewTopsClaims(filterParameters)[0]
      .Tin.map(item => item.Tin.replace(/-/g, ''))
      .toString();

    if (specificTin === 'All') {
      specificTin = null;
    }
    const requestBody = {
      tins: specificTin,
      timeFilter: timePeriod,
      timeFilterText: null,
      reason: reasonSelected,
      subReason: subReason,
      taxIdOwnership: 'OWNED',
      requestType: viewClaimTypeValue
    };
    return new Promise(resolve => {
      this.nonPaymentTopClaimsService.getViewTopClaimsData([this.providerKey], requestBody).subscribe(data => {
        const claimsData = data.ClaimsNonPaymentMetrics;
        resolve(claimsData);
      });
    });
  }
  getParameterviewTopsClaims(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [new GettingReimbursedPayload(param)];
    return parameters;
  } // end getParameterCategories() function for Top Reasons Categories
}
