import { Deserializable } from './deserializable.model';

export class UserProviderAssociation implements Deserializable {
  public userId: string;
  public providerKey: number;
  public providerGroup: string;
  public userRole: string;

  constructor(userId: string, providerKey: number, providerGroup: string, userRole: string) {
    this.userId = userId;
    this.providerKey = providerKey;
    this.providerGroup = providerGroup;
    this.userRole = userRole;
  }

  deserialize(arg: any): this {
    Object.assign(this, arg);
    return this;
  }
}
