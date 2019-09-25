import { Injectable } from '@angular/core';
import { SummaryTrendsService } from 'src/app/rest/summary-trends/summary-trends.service';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryTrendsSharedService {
  private metric: string;
  private date: string;
  constructor(private summarytrends: SummaryTrendsService, private session: SessionService) {}

  public sharedSummaryTrends() {
    return new Promise((resolve, reject) => {
      this.metric = this.session.filterObjValue.metric;
      this.date = this.session.filterObjValue.date;

      this.metric = 'GettingReimbursed';
      this.date = '2019-09-23';
      const params = { metricName: this.metric, searchDate: this.date };
      this.summarytrends.summaryTrendsData(params).subscribe(data => {
        const result: any = { dataSource: [], displayedColumns: [] };
        if (data) {
          if (this.metric === 'GettingReimbursed') {
            data.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsYield: element.ClaimsYieldUHCVarince,
                AmountPaid: element.TotalClaimsPaidUHCVarince,
                AmountDenied: element.TotalClaimsNotPaidUHCVarince,
                ActualAllowed: element.ActualAllowedVarince,
                ClaimsSubmitted: element.TotalClaimsSubmittedUHCVarince
              });
            });
            console.log(data);
            result.displayedColumns = [
              'ProviderName',
              'ClaimsYield',
              'AmountPaid',
              'AmountDenied',
              'ActualAllowed',
              'ClaimsSubmitted'
            ];
          } else if (this.metric === 'Appeals') {
            data.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsYield: element.ClaimsYieldUHCVarince,
                AmountPaid: element.TotalClaimsPaidUHCVarince,
                AmountDenied: element.TotalClaimsNotPaidUHCVarince,
                ActualAllowed: element.ActualAllowedVarince,
                ClaimsSubmitted: element.TotalClaimsSubmittedUHCVarince
              });
            });
            console.log(data);
            result.displayedColumns = [
              'ProviderName',
              'ClaimsYield',
              'AmountPaid',
              'AmountDenied',
              'ActualAllowed',
              'ClaimsSubmitted'
            ];
          } else if (this.metric === 'IssueResolution') {
            data.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsYield: element.ClaimsYieldUHCVarince,
                AmountPaid: element.TotalClaimsPaidUHCVarince,
                AmountDenied: element.TotalClaimsNotPaidUHCVarince,
                ActualAllowed: element.ActualAllowedVarince,
                ClaimsSubmitted: element.TotalClaimsSubmittedUHCVarince
              });
            });
            console.log(data);
            result.displayedColumns = [
              'ProviderName',
              'ClaimsYield',
              'AmountPaid',
              'AmountDenied',
              'ActualAllowed',
              'ClaimsSubmitted'
            ];
          } else if (this.metric === 'SelfService') {
            data.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsYield: element.ClaimsYieldUHCVarince,
                AmountPaid: element.TotalClaimsPaidUHCVarince,
                AmountDenied: element.TotalClaimsNotPaidUHCVarince,
                ActualAllowed: element.ActualAllowedVarince,
                ClaimsSubmitted: element.TotalClaimsSubmittedUHCVarince
              });
            });
            console.log(data);
            result.displayedColumns = [
              'ProviderName',
              'ClaimsYield',
              'AmountPaid',
              'AmountDenied',
              'ActualAllowed',
              'ClaimsSubmitted'
            ];
          } else if (this.metric === 'PriorAuthorization') {
            data.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsYield: element.ClaimsYieldUHCVarince,
                AmountPaid: element.TotalClaimsPaidUHCVarince,
                AmountDenied: element.TotalClaimsNotPaidUHCVarince,
                ActualAllowed: element.ActualAllowedVarince,
                ClaimsSubmitted: element.TotalClaimsSubmittedUHCVarince
              });
            });
            console.log(data);
            result.displayedColumns = [
              'ProviderName',
              'ClaimsYield',
              'AmountPaid',
              'AmountDenied',
              'ActualAllowed',
              'ClaimsSubmitted'
            ];
          }
        }
        resolve(result);
      });
    });
  }
}
