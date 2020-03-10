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

export interface ISelfService2 {
  All: {
    ClaimsLobSummary: [
      {
        AmountSubmitted: number;
        AmountPaid: number;
        DenialMonth: number;
        AmountDenied: number;
        ClaimsDenied: number;
        AmountBilled: number;
        AmountCompleted: number;
        AmountUHCPaid: number;
        AmountActualAllowed: number;
        AmountExpectedAllowed: number;
        PatientResponsibleAmount: number;
        WriteOffAmount: number;
        EstimatedAllowedSelectDeniedAmount: number;
        ProviderNotCoveredAmount: number;
        DosToReceived: number;
        ReceivedToPaid: number;
        ClaimsCompleted: number;
        ClaimsYieldRate: number;
        ClaimsNonPaymentRate: number;
        AvgDosToReceived: number;
        AvgReceivedToPaid: number;
        ClaimsAvgTat: number;
        ClaimsSubmitted: number;
        ClaimsPaid: number;
      }
    ];
    DenialCategory: null;
  };
  Startdate: string;
  Enddate: string;
  Providerkey: number;
  Cs: {
    ClaimsLobSummary: [
      {
        AmountSubmitted: number;
        AmountPaid: number;
        DenialMonth: number;
        AmountDenied: number;
        ClaimsDenied: number;
        AmountBilled: number;
        AmountCompleted: number;
        AmountUHCPaid: number;
        AmountActualAllowed: number;
        AmountExpectedAllowed: number;
        PatientResponsibleAmount: number;
        WriteOffAmount: number;
        EstimatedAllowedSelectDeniedAmount: number;
        ProviderNotCoveredAmount: number;
        DosToReceived: number;
        ReceivedToPaid: number;
        ClaimsCompleted: number;
        ClaimsYieldRate: number;
        ClaimsNonPaymentRate: number;
        AvgDosToReceived: number;
        AvgReceivedToPaid: number;
        ClaimsAvgTat: number;
        ClaimsSubmitted: number;
        ClaimsPaid: number;
      }
    ];
    DenialCategory: null;
  };
  Ei: {
    ClaimsLobSummary: [
      {
        AmountSubmitted: number;
        AmountPaid: number;
        DenialMonth: number;
        AmountDenied: number;
        ClaimsDenied: number;
        AmountBilled: number;
        AmountCompleted: number;
        AmountUHCPaid: number;
        AmountActualAllowed: number;
        AmountExpectedAllowed: number;
        PatientResponsibleAmount: number;
        WriteOffAmount: number;
        EstimatedAllowedSelectDeniedAmount: number;
        ProviderNotCoveredAmount: number;
        DosToReceived: number;
        ReceivedToPaid: number;
        ClaimsCompleted: number;
        ClaimsYieldRate: number;
        ClaimsNonPaymentRate: number;
        AvgDosToReceived: number;
        AvgReceivedToPaid: number;
        ClaimsAvgTat: number;
        ClaimsSubmitted: number;
        ClaimsPaid: number;
      }
    ];
    DenialCategory: null;
  };
  Mr: {
    ClaimsLobSummary: [
      {
        AmountSubmitted: number;
        AmountPaid: number;
        DenialMonth: number;
        AmountDenied: number;
        ClaimsDenied: number;
        AmountBilled: number;
        AmountCompleted: number;
        AmountUHCPaid: number;
        AmountActualAllowed: number;
        AmountExpectedAllowed: number;
        PatientResponsibleAmount: number;
        WriteOffAmount: number;
        EstimatedAllowedSelectDeniedAmount: number;
        ProviderNotCoveredAmount: number;
        DosToReceived: number;
        ReceivedToPaid: number;
        ClaimsCompleted: number;
        ClaimsYieldRate: number;
        ClaimsNonPaymentRate: number;
        AvgDosToReceived: number;
        AvgReceivedToPaid: number;
        ClaimsAvgTat: number;
        ClaimsSubmitted: number;
        ClaimsPaid: number;
      }
    ];
    DenialCategory: null;
  };
  Un: {
    ClaimsLobSummary: [
      {
        AmountSubmitted: number;
        AmountPaid: number;
        DenialMonth: number;
        AmountDenied: number;
        ClaimsDenied: number;
        AmountBilled: number;
        AmountCompleted: number;
        AmountUHCPaid: number;
        AmountActualAllowed: number;
        AmountExpectedAllowed: number;
        PatientResponsibleAmount: number;
        WriteOffAmount: number;
        EstimatedAllowedSelectDeniedAmount: number;
        ProviderNotCoveredAmount: number;
        DosToReceived: number;
        ReceivedToPaid: number;
        ClaimsCompleted: number;
        ClaimsYieldRate: number;
        ClaimsNonPaymentRate: number;
        AvgDosToReceived: number;
        AvgReceivedToPaid: number;
        ClaimsAvgTat: number;
        ClaimsSubmitted: number;
        ClaimsPaid: number;
      }
    ];
    DenialCategory: string;
  };
  Tin: number;
  ReportingPeriod: string;
  ProviderSystem: string;
}
