import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { PerformanceModule } from '../../components/performance/performance.module';
import { rlpPageName } from '../../modals/rlp-data';

export const endpoints = {
  labs: 'LAB_VISITS_HCO',
  referral: 'SPECIALIST_REFERRAL_HCO',
  perscription: 'PRESCRIBING_PROVIDER_HCO'
};

export const getCategoryAndType = [
  { category: 'app-large-card', type: 'rlp-large-bar' },
  { category: 'app-card', type: 'rlp-small-bar' }
];
export const pageMapApiEndpoint = [
  {
    name: rlpPageName.Referral,
    apiPoint: endpoints.referral,
    title: 'Preferred Specialist Referral Rate',
    suffix: 'Referral'
  },
  { name: rlpPageName.Labs, apiPoint: endpoints.labs, title: 'Preferred Lab Network Use Rate', suffix: 'Referral' },
  {
    name: rlpPageName.Perscription,
    apiPoint: endpoints.perscription,
    title: 'Preferred Tier Prescribing Rate',
    suffix: 'Referral'
  }
];
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

  public getHCOdata(pageName: string, chartType: string) {
    const getStaticData = pageMapApiEndpoint.find(item => item.name === pageName);
    const getCandType = getCategoryAndType.find(item => item.category === chartType);
    return new Promise(resolve => {
      this.performanceRestService
        // .getNetworkLeversData(this.session.providerKeyData(), getStaticData.apiPoint, this.requestBody)
        .getNetworkLeversData(951, getStaticData.apiPoint, this.requestBody)
        .subscribe(
          response => {
            const newData = {
              category: getCandType.category,
              type: getCandType.type,
              title: getStaticData.title,
              toggle: this.toggle.setToggles(getStaticData.title, pageName, 'Performance', false),
              MetricID: '',
              data: {
                gdata: {
                  count:
                    response[0].Numerator.toFixed(0) +
                    '/' +
                    response[0].Denominator.toFixed(0) +
                    ' ' +
                    getStaticData.suffix,
                  percentage: response[0].RateWithPercentage
                }
              }
            };
            resolve(newData);
            console.log('HCO Data', response);
          },
          err => {
            console.log('HCO Data Error', pageName, err);
          }
        );
    });
  }
}
