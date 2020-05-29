export interface ISmartEdits {
  Tin: any;
  ProviderKey: number;
  PeriodStart: string;
  PeriodEnd: string;
  Reasons: Reasons[];
}

export interface Reasons {
  Code: string;
  Description: string;
  Value: number;
  Percentage: number;
}

export interface ISmartEditsResponse {
  Status: string;
  StatusCode: number;
  Message: string;
  Data: ISmartEdits;
  TimeStamp: string;
}
