export class Providers {
  constructor(public ProviderKey: number, public HealthCareOrganizationName: string) {}
}

export interface IUserResponse {
  [index: number]: Providers[];
}
