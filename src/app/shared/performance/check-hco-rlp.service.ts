import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { HeadModule } from '../../head/head.module';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: HeadModule
})
export class CheckHcoRlpService {
  public requestBody: Object;
  rlpAllHco$: Subscription;
  constructor(private performanceRestService: PerformanceRestService) {
    this.requestBody = { timeFilter: 'YTD' };
  }
  public checkRlpHCO(providerSyskey) {
    return new Promise(resolve => {
      this.rlpAllHco$ = this.performanceRestService.getAllHcoRlp(providerSyskey, this.requestBody).subscribe(
        response => {
          resolve(response);
        },
        err => {
          console.log('Check All RLP HCO Data Error', err);
        }
      );
    });
  }

  public uncheckRlpHCO() {
    this.rlpAllHco$.unsubscribe();
  }
}
