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
