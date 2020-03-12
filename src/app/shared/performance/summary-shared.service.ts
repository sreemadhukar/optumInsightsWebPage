import { Injectable } from '@angular/core';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SummarySharedService {
  public timeFrame;
  public tin;
  public lob;
  public providerKey;

  constructor(
    private MetricidService: GlossaryMetricidService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private performanceRestService: PerformanceRestService
  ) {}

  getParameterCategories(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey];
    return parameters;
  }

  public referralsShared(param) {
    console.log('Hiii Referals2');
    this.timeFrame = this.common.getTimePeriodFilterValue(param.timePeriod);
    // this.lob = param.lineOfBusiness ? _.startCase(param.lineOfBusiness.toLowerCase()) : 'All';
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      const parameters = this.getParameterCategories(param);
      parameters[1] = '?requestType=SPECIALIST_REFERRAL_HCO';
      this.performanceRestService.getNetworkLeversData(...parameters).subscribe(
        networkReferralsData => {
          resolve(networkReferralsData);
          console.log('networkReferralsData', networkReferralsData);
        },
        err => {
          console.log('Advocate Page , Error for Payment cards', err);
        }
      );
    });
  }
}
