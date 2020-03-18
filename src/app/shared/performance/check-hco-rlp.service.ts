import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { HeadModule } from '../../head/head.module';

@Injectable({
  providedIn: HeadModule
})
export class CheckHcoRlpService {
  public requestBody: Object;
  constructor(private performanceRestService: PerformanceRestService) {
    this.requestBody = { timeFilter: 'YTD' };
  }
  public checkRlpHCO(providerSyskey) {
    console.log('Shared HCO ALL check', providerSyskey);
    return new Promise(resolve => {
      this.performanceRestService
        // .getNetworkLeversData(this.session.providerKeyData(), getStaticData.apiPoint, this.requestBody)
        .getAllHcoRlp(providerSyskey, this.requestBody)
        .subscribe(
          response => {
            console.log('All HCO Response Data', response);
            resolve(response);
          },
          err => {
            console.log('Check All RLP HCO Data Error', err);
          }
        );
    });
  }
}
