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
  {
    name: rlpPageName.Labs,
    apiPoint: endpoints.labs,
    title: 'Preferred Lab Network Use Rate',
    suffix: 'Preferred Lab Visits'
  },
  {
    name: rlpPageName.Perscription,
    apiPoint: endpoints.perscription,
    title: 'Preferred Tier Prescribing Rate',
    suffix: 'Prescriptions'
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

  /**
   * getHCOdata function prepares the template for HCO data of the app-card and long-card
   * @param pageName  pageName is to map the enpoint corresponding to that page
   * @param chartType  chartType is to map the corresponding bar type
   */

  public getHCOdata(pageName: string, chartType: string) {
    const getStaticData = pageMapApiEndpoint.find(item => item.name === pageName);
    const getCandType = getCategoryAndType.find(item => item.category === chartType);
    return new Promise(resolve => {
      this.performanceRestService
        // .getNetworkLeversData(this.session.providerKeyData(), getStaticData.apiPoint, this.requestBody)
        .getNetworkLeversData(951, getStaticData.apiPoint, this.requestBody)
        .subscribe(
          response => {
            let newData = null;
            if (response) {
              newData = {
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
                },
                timeperiod: 'YTD (Jan 1, 2020—Mar 31, 2020)'
              };
            }
            console.log('Shared Response HCO Data', pageName, response);
            console.log('Shared New Data HCO Data', pageName, newData);
            resolve(newData);
          },
          err => {
            console.log('HCO Data Error', pageName, err);
          }
        );
    });
  }
}
