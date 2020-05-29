export class GettingReimbursedPayload {
  TimeFilter: string;
  Lob: string;
  FundingTypeCodes: string;
  Tin: string;
  TimeFilterText: string;
  OrgType: string;
  appealsProcessing: string;
  ClaimsBy: string;
  constructor(param) {
    param.lineOfBusiness ? (this.Lob = param.lineOfBusiness) : delete this.Lob;
    param.commercial ? (this.FundingTypeCodes = param.commercial) : delete this.FundingTypeCodes;
    param.claimsFilter ? (this.OrgType = param.claimsFilter) : delete this.OrgType;
    param.viewClaimsByFilter ? (this.ClaimsBy = param.viewClaimsByFilter) : delete this.ClaimsBy;
    param.appealsFilter ? (this.appealsProcessing = param.appealsFilter) : delete this.appealsProcessing;
    param.taxId ? (this.Tin = param.taxId) : delete this.Tin;
    if (
      param.timePeriod === 'Last12Months' ||
      param.timePeriod === 'Last6Months' ||
      param.timePeriod === 'Last3Months' ||
      param.timePeriod === 'Last30Days' ||
      param.timePeriod === 'YTD'
    ) {
      this.TimeFilter = param.timePeriod;
      delete this.TimeFilterText;
    } else {
      this.TimeFilter = 'CalendarYear';
      this.TimeFilterText = param.timePeriod;
    }
  }
}
