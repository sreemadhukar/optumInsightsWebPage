import { Deserializable } from './deserializable.model';

export class UserProfile implements Deserializable {
  public userId: string;
  public providerKey: number;
  public providerGroup: string;
  public userRole: string;
  public modules: string[] = [];
  public persona: string;

  constructor(
    userId: string,
    providerKey: number,
    providerGroup: string,
    userRole: string,
    modules: string[],
    persona: string
  ) {
    this.userId = userId;
    this.providerKey = providerKey;
    this.providerGroup = providerGroup;
    this.userRole = userRole;
    this.modules = modules;
    this.persona = persona;
  }

  deserialize(arg: any): this {
    Object.assign(this, arg);
    return this;
  }
}
