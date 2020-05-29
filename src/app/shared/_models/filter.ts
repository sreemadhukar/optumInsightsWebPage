export class Filter {
  public timeFrame: string;
  public lob: string;
  public tax: Array<string>;
  public taxwithSymbols: Array<string>;
  public serviceSetting?: string;
  public priorAuthType?: string;
  public serviceCategory?: string;
  public date?: Date;
  public metric?: string;
}
