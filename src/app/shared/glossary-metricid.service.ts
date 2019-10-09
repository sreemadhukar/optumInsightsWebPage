import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlossaryMetricidService {
  public MetricIDs: any;
  constructor() {
    this.MetricIDs = {
      TopReasonsforClaimsNonPayment: '100',
      ClaimAppealsOverturnRate: '101',
      TopClaimAppealsOverturnReasons: '102',
      ClaimsPaid: '103',
      ClaimsYield: '104',
      ClaimsAppealsSubmitted: '105',
      ClaimAppealsOverturned: '106',
      ClaimsNotPaid: '107',
      ClaimsNonPaymentRate: '108',
      TotalClaimsSubmitted: '109',
      ActualAllowed: '110',
      ExpectedAllowed: '111',
      ClaimsPaidBreakdown: '112',
      ClaimsPaymentIntegrity: '113',
      TotalNumberofClaimsSubmitted: '114',
      MedicareStarRating: '200',
      PriorAuthorizationRequested: '201',
      TopReasonsforPriorAuthorizationsNotApproved: '202',
      PriorAuthorizationApprovalRate: '203',
      MedicareRetirementAnnualCareVisitsCompletionRateAll: '204',
      MedicareRetirementAnnualCareVisitsCompletionRateDiabetic: '205',
      QualityStarRatings: '206',
      TotalCalls: '300',
      PaperlessDelivery: '301',
      LinkEDItoCallRatio: '302',
      CallsbyCallType: '303',
      TalkTimebyCallType: '304',
      SelfServiceAdoptionRate: '305',
      ReduceReconsiderationProcessingBy: '306',
      SaveyourStaffsTimeBy: '307',
      ReduceCallsOperatingCostsBy: '308',
      ReduceClaimProcessingTimeBy: '309',
      ClaimsAverageTurnaroundTimetoPayment: 'NA',
      ClaimsSubmissions: 'NA',
      ClaimsPayments: 'NA',
      ClaimsNonPayments: 'NA',
      ClaimsAppeals: 'NA',
      PriorAuthorizationApproval: 'NA',
      ClaimsNonPaymentTrend: 'NA',
      ClaimsAppealsSubmittedTrend: 'NA'
    };
  }
}
