export const dropdownOptions = [
  { value: 'hco', viewValue: 'Health System Name', currentPlaceholder: 'Search By Health System Name' },
  { value: 'tin', viewValue: 'Tax Id Number', currentPlaceholder: 'Search By Tax Id Number' },
  { value: 'TinName', viewValue: 'Tax Id Name', currentPlaceholder: 'Search By Tax Id Name' }
];
export interface IUserResponse {
  BicId: number;
  Tin: string;
  TinName: string;
  ProviderSystem: string;
  ProviderSysKey: number;
  ActiveTaxIds: number;
}
