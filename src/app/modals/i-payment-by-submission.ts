export interface IPayBySubClaimsLobSumry {
  AmountActualAllowed: number;
  AmountBilled: number;
  AmountCompleted: number;
  AmountDenied: number;
  AmountExpectedAllowed: number;
  AmountPaid: number;
  AmountSubmitted: number;
  AmountUHCPaid: number;
  AvgDosToReceived: number;
  AvgReceivedToPaid: number;
  ClaimsAvgTat: number;
  ClaimsCompleted: number;
  ClaimsDenied: number;
  ClaimsNonPaymentRate: number;
  ClaimsPaid: number;
  ClaimsSubmitted: number;
  ClaimsYieldRate: number;
  DenialMonth: any;
  DosToReceived: number;
  EstimatedAllowedSelectDeniedAmount: number;
  PatientResponsibleAmount: number;
  ProviderNotCoveredAmount: number;
  ReceivedToPaid: number;
  WriteOffAmount: number;
}
export interface IPayBySubLob {
  ClaimsLobSummary: IPayBySubClaimsLobSumry[];
  DenialCategory: any;
}
export interface IPayBySubNest1 {
  All: any;
  Cs: any;
  Ei: any;
  Mr: any;
  Un: any;
  ProviderSystem: string;
  Providerkey: number;
  Enddata: string;
  Startdate: string;
  Tin: any;
  ReportingPeriod: any;
}
export interface IPaymentBySubResponse {
  EDISubmissions: IPayBySubNest1;
  PaperSubmissions: IPayBySubNest1;
}
