import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { SummaryTrendsService } from '../../rest/summary-trends/summary-trends.service';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SummaryTrendsSharedService {
  private metric: string;
  private date: any;
  constructor(private summarytrends: SummaryTrendsService, private session: SessionService) {}

  public sharedSummaryTrends(pageNumber, pageSize, column, direction) {
    return new Promise((resolve, reject) => {
      this.metric = this.session.filterObjValue.metric;
      this.date = formatDate(this.session.filterObjValue.date, 'yyyy-MM-dd', 'en');
      // this.date = '2019-09-25';
      const params = {
        MetricName: this.metric,
        SearchDate: this.date,
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortColumn: column,
        SortDirection: direction
      };
      this.summarytrends.summaryTrendsData(params).subscribe(data => {
        console.log(data);
        const result: any = { dataSource: [], displayedColumns: [], totalRecordsCount: 0 };
        if (data && data.ResultSet) {
          if (this.metric === 'GettingReimbursed') {
            data.ResultSet.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                ClaimsPaidByUHC: element.ClaimsPaidByUHC,
                ClaimsYield: element.ClaimsYield,
                TotalClaimsSubmitted: element.TotalClaimsSubmitted,
                TotalClaimsPaid: element.TotalClaimsPaid,
                TotalClaimsNotPaid: element.TotalClaimsNotPaid,
                TotalBilled: element.TotalBilled,
                ActualAllowed: element.ActualAllowed,
                AmountExpectedAllowed: element.AmountExpectedAllowed,
                DeniedAmount: element.DeniedAmount,
                NonPaymentRate: element.NonPaymentRate,

                ClaimsPaidByUHCVarince: element.ClaimsPaidByUHCVarince,
                ClaimsYieldVarince: element.ClaimsYieldVarince,
                TotalClaimsSubmittedVarince: element.TotalClaimsSubmittedVarince,
                TotalClaimsPaidVarince: element.TotalClaimsPaidVarince,
                TotalClaimsNotPaidVarince: element.TotalClaimsNotPaidVarince,
                TotalBilledVarince: element.TotalBilledVarince,
                ActualAllowedVarince: element.ActualAllowedVarince,
                AmountExpectedAllowedVarince: element.AmountExpectedAllowedVarince,
                DeniedAmountVarince: element.DeniedAmountVarince,
                NonPaymentRateVarince: element.NonPaymentRateVarince
              });
            });
            result.displayedColumns = [
              'ProviderName',
              'ClaimsPaidByUHC',
              'ClaimsYield',
              'TotalClaimsSubmitted',
              'TotalClaimsPaid',
              'TotalClaimsNotPaid',
              'TotalBilled',
              'ActualAllowed',
              'DeniedAmount',
              'NonPaymentRate'
            ];
          } else if (this.metric === 'Appeals') {
            data.ResultSet.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                TotalAppeals: element.TotalAppeals,
                AdminAppeals: element.AdminAppeals,
                ClinicalAppeals: element.ClinicalAppeals,
                OverTurnCount: element.OverTurnCount,
                TotalAppealsVarince: element.TotalAppealsVarince,
                AdminAppealsVarince: element.AdminAppealsVarince,
                ClinicalAppealsVarince: element.ClinicalAppealsVarince,
                OverTurnCountVarince: element.OverTurnCountVarince
              });
            });
            result.displayedColumns = [
              'ProviderName',
              'TotalAppeals',
              'AdminAppeals',
              'ClinicalAppeals',
              'OverTurnCount'
            ];
          } else if (this.metric === 'IssueResolution') {
            data.ResultSet.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                TotalCallsByType: element.TotalCallsByType,
                TotalTalkTimeByCallType: element.TotalTalkTimeByCallType,
                TotalCallsByTypeVarince: element.TotalCallsByTypeVarince,
                TotalTalkTimeByCallTypeVarince: element.TotalTalkTimeByCallTypeVarince
              });
            });
            result.displayedColumns = ['ProviderName', 'TotalCallsByType', 'TotalTalkTimeByCallType'];
          } else if (this.metric === 'SelfService') {
            data.ResultSet.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                LinkAndEdiCallRatio: element.LinkAndEdiCallRatio,
                ReconsiderationProcessing: element.ReconsiderationProcessing,
                ClaimProcessingTimeByMail: element.ClaimProcessingTimeByMail,
                TotalCallTime: element.TotalCallTime,
                ClaimProcessingTimeBySelfService: element.ClaimProcessingTimeBySelfService,
                ProcessingTimePerReconsiderationByMail: element.ProcessingTimePerReconsiderationByMail,
                CallsAndOperatingCost: element.CallsAndOperatingCost,
                ClaimProcessingTime: element.ClaimProcessingTime,
                SelfServiceAdoptionRate: element.SelfServiceAdoptionRate,
                PaperLessDocument: element.PaperLessDocument,
                ProcessingTimePerReconsiderationBySelfService: element.ProcessingTimePerReconsiderationBySelfService,
                LinkAndEdiCallRatioVarince: element.LinkAndEdiCallRatioVarince,
                ReconsiderationProcessingVarince: element.ReconsiderationProcessingVarince,
                ClaimProcessingTimeByMailVarince: element.ClaimProcessingTimeByMailVarince,
                TotalCallTimeVarince: element.TotalCallTimeVarince,
                ClaimProcessingTimeBySelfServiceVarince: element.ClaimProcessingTimeBySelfServiceVarince,
                ProcessingTimePerReconsiderationByMailVarince: element.ProcessingTimePerReconsiderationByMailVarince,
                CallsAndOperatingCostVarince: element.CallsAndOperatingCostVarince,
                ClaimProcessingTimeVarince: element.ClaimProcessingTimeVarince,
                SelfServiceAdoptionRateVarince: element.SelfServiceAdoptionRateVarince,
                PaperLessDocumentVarince: element.PaperLessDocumentVarince,
                ProcessingTimePerReconsiderationBySelfServiceVarince:
                  element.ProcessingTimePerReconsiderationBySelfServiceVarince
              });
            });
            result.displayedColumns = [
              'ProviderName',
              'LinkAndEdiCallRatio',
              // 'ReconsiderationProcessing',
              // 'ClaimProcessingTimeByMail',
              // 'TotalCallTime',
              // 'ClaimProcessingTimeBySelfService',
              // 'ProcessingTimePerReconsiderationByMail',
              // 'CallsAndOperatingCost',
              // 'ClaimProcessingTime',
              'SelfServiceAdoptionRate',
              'PaperLessDocument'
              // 'ProcessingTimePerReconsiderationBySelfService'
            ];
          } else if (this.metric === 'PriorAuthorization') {
            data.ResultSet.forEach(element => {
              result.dataSource.push({
                ProviderName: element.ProviderOrganisationName,
                PriorAuthApprovedCount: element.PriorAuthApprovedCount,
                PriorAuthNotApprovedCount: element.PriorAuthNotApprovedCount,
                InPatientFacilityApprovalRate: element.InPatientFacilityApprovalRate,
                OutPatientFacilityApprovalRate: element.OutPatientFacilityApprovalRate,
                PriorAuthPendingCount: element.PriorAuthPendingCount,
                AverageTat: element.AverageTat,
                UrgentTat: element.UrgentTat,
                TotalPaRequested: element.TotalPaRequested,
                PriorAuthCancelledCount: element.PriorAuthCancelledCount,
                PaApprovalRate: element.PaApprovalRate,
                OutPatientApprovalRate: element.OutPatientApprovalRate,

                PriorAuthApprovedCountVarince: element.PriorAuthApprovedCountVarince,
                PriorAuthNotApprovedCountVarince: element.PriorAuthNotApprovedCountVarince,
                InPatientFacilityApprovalRateVarince: element.InPatientFacilityApprovalRateVarince,
                OutPatientFacilityApprovalRateVarince: element.OutPatientFacilityApprovalRateVarince,
                PriorAuthPendingCountVarince: element.PriorAuthPendingCountVarince,
                AverageTatVarince: element.AverageTatVarince,
                UrgentTatVarince: element.UrgentTatVarince,
                TotalPaRequestedVarince: element.TotalPaRequestedVarince,
                PriorAuthCancelledCountVarince: element.PriorAuthCancelledCountVarince,
                PaApprovalRateVarince: element.PaApprovalRateVarince,
                OutPatientApprovalRateVarince: element.OutPatientApprovalRateVarince
              });
            });
            result.displayedColumns = [
              'ProviderName',
              'PriorAuthApprovedCount',
              'PriorAuthNotApprovedCount',
              'InPatientFacilityApprovalRate',
              'OutPatientFacilityApprovalRate',
              'PriorAuthPendingCount',
              // 'AverageTat',
              'UrgentTat',
              'TotalPaRequested',
              // 'PriorAuthCancelledCount',
              'PaApprovalRate',
              'OutPatientApprovalRate'
            ];
          }
        }

        resolve(result);
      });
    });
  }

  public sharedSummaryTrendsCount() {
    return new Promise((resolve, reject) => {
      this.metric = this.session.filterObjValue.metric;
      this.date = formatDate(this.session.filterObjValue.date, 'yyyy-MM-dd', 'en');
      const params = {
        MetricName: this.metric,
        SearchDate: this.date
      };
      this.summarytrends.summaryTrendsCount(params).subscribe(data => {
        if (data.TotalRecords.length > 0) {
          resolve(data.TotalRecords[0].ProviderSysKey);
        } else {
          resolve(0);
        }
      });
    });
  }
}
