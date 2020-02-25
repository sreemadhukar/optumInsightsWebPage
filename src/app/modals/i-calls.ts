interface CallsMetricsI {
  BenefitsEligibility: number;
  Claims: number;
  PriorAuth: number;
  Others: number;
  Total: number;
}

export interface ICalls {
  ProviderSysKey: number;
  CallVolByQuesType: CallsMetricsI;
  CallTalkTimeByQuesType: CallsMetricsI;
  ReportStartDate: string;
  ReportEndDate: string;
  CreateDate: string;
  test: any;
}
