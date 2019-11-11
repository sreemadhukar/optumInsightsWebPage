import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { HealthSystemDetailsService } from '../../rest/advocate/health-system-details.service';

@Injectable({
  providedIn: 'root'
})
export class HealthSystemDetailsSharedService {
  public providerKey;

  constructor(private session: SessionService, private healthSystemDetailsService: HealthSystemDetailsService) {}

  public getHealthSystemData() {
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      this.healthSystemDetailsService.getHealthSystemData(this.providerKey).subscribe(
        healthSystemData => {
          resolve(healthSystemData);
        },
        err => {
          console.log('Advocate Page , Error for appeals cards', err);
        }
      );
    });
  }
}
