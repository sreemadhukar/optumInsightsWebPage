interface CallsMetricsI {
  BenefitsEligibility: number;
  Claims: number;
  PriorAuth: number;
  Others: number;
  Total: number;
}

interface ICalls {
  ProviderSysKey: number;
  CallVolByQuesType: CallsMetricsI;
  CallTalkTimeByQuesType: CallsMetricsI;
  ReportStartDate: string;
  ReportEndDate: string;
  CreateDate: string;
  test: any;
}
export interface ICallsResponse {
  Status: string;
  StatusCode: number;
  Message: string;
  Data: ICalls;
}
