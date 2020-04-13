export class UserHCO {
  constructor(public ProviderSystem: string, public ActiveTaxIds: number, public BicId: number) {}
}
export class UserTin {
  constructor(public Tin: string, public Tinname: string, public ProviderSystem: string) {}
}
export class UserTinname {
  constructor(public Tinname: string, public Tin: string, public ProviderSystem: string) {}
}
export interface IUserResponse {
  BicId: number;
  Tin: string;
  TinName: string;
  ProviderSystem: string;
  ProviderSysKey: number;
  ActiveTaxIds: number;
}
