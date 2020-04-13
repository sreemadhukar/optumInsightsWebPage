export class User {
  constructor(public BicId: number, public Tin: string, public TinName: string) {}
}

export interface IUserResponse {
  BicId: number;
  Tin: string;
  TinName: string;
  ProviderSystem: string;
  ProviderSysKey: number;
  ActiveTaxIds: number;
}
