export interface ISelfService {
  ProviderSysKey: number;
  HealthCareOrganizationName: string;
  RecordRefreshDate: string;
  ReportingPeriod: string;
  SelfServiceInquiries: {
    ALL: {
      SelfService: {
        AverageClaimCount: number;
        AverageClaimProcessingTime: number;
        AveragePaperReconsideredProcessingTime: number;
        AveragePaperClaimProcessingTime: number;
        AverageReconsideredProcessingTime: number;
        ReconsideredProcessingTimeDifferential: number;
        ClaimProcessingTimeDifferential: number;
        AveragePaperReconsideredCount: number;
        EligibilityCallCount: number;
        AveragePaperClaimCount: number;
        BenefitsCallCount: number;
        TotalCallTime: number;
        PhoneCallTime: number;
        SelfServiceCallTime: number;
        TotalCallCost: number;
        TotalPhoneCost: number;
        TotalSelfServiceCost: number;
        TotalCallCount: number;
        ReduceClaimCost: number;
        ClaimPhoneCost: number;
        SelfServicePhoneCost: number;
        TotalClaimCallCount: number;
        ReduceEligibilityAndBenefitsCost: number;
        EligibilityAndBenefitPhoneCost: number;
        EligibilityAndBenefitSelfServiceCost: number;
        EligibilityAndBenefitCallCount: number;
        ReducePriorAuthorizationsCost: number;
        PriorAuthorizationsPhoneCost: number;
        PriorAuthorizationsSelfServiceCost: number;
        AuthCallCount: number;
      };
      Utilizations: {
        LinkAdoptionRate: number;
        OverallLinkAdoptionRate: number;
        PaperAndPostageAdoptionRate: number;
        PaperAndPostageElectronicWeighting: number;
        PaperAndPostagePaperWeighting: number;
        SelfServiceCallsAndClaimsWeighting: number;
        SizeOfOpportunityCallsAndClaimsWeighting: number;
        SizeOfOpportunityCallsAndClaimsPaperAndPostageWeighting: number;
      };
      RecordRefreshDate: string;
      ReportingPeriodStartDate: string;
      ReportingPeriodEndDate: string;
    };
  };
  ResolvingIssues: Object;
  PriorAuth: string;
  PatientCareOpportunity: string;
}
