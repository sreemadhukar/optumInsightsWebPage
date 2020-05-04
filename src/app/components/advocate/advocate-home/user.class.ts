export interface IAdvTinDetailsResponse {
  AccountName: string;
  AccountType: string;
  BicId: number;
  EmailId: string;
  FormattedTin: string;
  Market: string;
  MsId: string;
  ProviderSysKey: number;
  ProviderSystem: string;
  Region: string;
  RelatedContactType: string;
  TaxIdType: string;
  Tin: string;
  TinName: string;
}

// This is for dropdown size of the table
export const pageSizeConf: Array<string> = ['9', '18', '27'];
// This is initialize the pagination
export const INITIAL_PAGINATION = {
  currentPageNumber: 1,
  setIndex: 0,
  endIndex: +pageSizeConf[0]
};
export const dropdownOptions = [
  { value: 'hco', viewValue: 'Health System Name' },
  { value: 'tin', viewValue: 'Tax ID Number' },
  { value: 'TinName', viewValue: 'Tax ID Name' }
];
export interface IUserResponse {
  BicId: number;
  Tin: string;
  TinName: string;
  ProviderSystem: string;
  ProviderSysKey: number;
  ActiveTaxIds: number;
}
