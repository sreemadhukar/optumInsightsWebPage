export class GettingReimbursedPayload {
  TimeFilter: string;
  Lob: string;
  Tin: string;
  TimeFilterText: string;

  constructor(param) {
    param.lineOfBusiness ? (this.Lob = param.lineOfBusiness) : delete this.Lob;
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
