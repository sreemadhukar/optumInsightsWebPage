import { Injectable } from '@angular/core';
import { SessionService } from '../../session.service';
import { GettingReimbursedPayload } from '../payload.class';
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
    private readonly nonPaymentTopClaimsService: NonPaymentTopClaimsService,
    private readonly session: SessionService
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
