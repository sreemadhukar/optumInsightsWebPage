import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { PerformanceModule } from '../../components/performance/performance.module';
export const endpoints = {
  labs: 'LAB_VISITS_HCO',
  referral: 'SPECIALIST_REFERRAL_HCO',
  perscription: 'PRESCRIBING_PROVIDER_HCO'
};
@Injectable({
  providedIn: PerformanceModule
})
export class SummarySharedService {
  public requestBody;
  constructor(
    private MetricidService: GlossaryMetricidService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private performanceRestService: PerformanceRestService
  ) {
    this.requestBody = { timeFilter: 'YTD' };
  }

  public referralsShared(param) {
    return new Promise(resolve => {
      this.performanceRestService
        .getNetworkLeversData(this.session.providerKeyData(), endpoints.referral, this.requestBody)
        .subscribe(
          data => {
            resolve(data);
            console.log('referralsData', data);
          },
          err => {
            console.log('Advocate Page , Error for Payment cards', err);
          }
        );
    });
  }

  public labsShared(param) {
    return new Promise(resolve => {
      this.performanceRestService
        .getNetworkLeversData(this.session.providerKeyData(), endpoints.labs, this.requestBody)
        .subscribe(
          data => {
            resolve(data);
            console.log('labs', data);
          },
          err => {
            console.log('Advocate Page , Error for Payment cards', err);
          }
        );
    });
  }

  public prescriptionShared(param) {
    return new Promise(resolve => {
      this.performanceRestService
        .getNetworkLeversData(this.session.providerKeyData(), endpoints.perscription, this.requestBody)
        .subscribe(
          data => {
            resolve(data);
            console.log('perscripton', data);
          },
          err => {
            console.log('Advocate Page , Error for Payment cards', err);
          }
        );
    });
  }
}
