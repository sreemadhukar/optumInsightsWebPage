import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public timeFrame = 'Rolling 12 Months';
  public lob = 'All';
  public providerkey = 281;
  public tin = 'All';
  constructor() {}

  get getProviderkey(): number {
    return this.providerkey;
  }

  set setProviderkey(value: number) {
    this.providerkey = value;
  }

  get getTin(): string {
    return this.tin;
  }

  set setTin(value: string) {
    this.tin = value;
  }

  get getTimeFrame(): string {
    return this.timeFrame;
  }
  set setTimeFrame(value: string) {
    this.timeFrame = value;
  }

  get getLob(): string {
    return this.lob;
  }

  set setLob(value: string) {
    this.lob = this.lob;
  }
}
