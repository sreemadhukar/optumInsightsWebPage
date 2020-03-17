import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { PerformanceModule } from '../../components/performance/performance.module';
import { rlpPageName, rlpCardType, rlpBarType } from '../../modals/rlp-data';
import { CommonUtilsService } from '../common-utils.service';

export const getCategoryAndType = [
  { category: rlpCardType.longCard, type: rlpBarType.longCard },
  { category: rlpCardType.appCard, type: rlpBarType.appCard }
];
export const pageMapApiEndpoint = [
  {
    name: rlpPageName.Referral,
    title: 'Preferred Specialist Referral Rate',
    suffix: 'Referral',
    MetricID: ''
  },
  {
    name: rlpPageName.Labs,
    title: 'Preferred Lab Network Use Rate',
    suffix: 'Preferred Lab Visits',
    MetricID: ''
  },
  {
    name: rlpPageName.Perscription,
    title: 'Preferred Tier Prescribing Rate',
    suffix: 'Prescriptions',
    MetricID: ''
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
    private performanceRestService: PerformanceRestService,
    private common: CommonUtilsService
  ) {
    this.requestBody = { timeFilter: 'YTD' };
  }

  /**
   * getHCOdata function prepares the template for HCO data of the app-card and long-card
   * @param pageName  pageName is to map the enpoint corresponding to that page
   * @param chartType  chartType is to map the corresponding bar type There are only two type :- aap-card, app-long-card
   */

  public getHCOdata(pageName: string, chartType: string) {
    const getStaticData = pageMapApiEndpoint.find(item => item.name === pageName);
    const getCandType = getCategoryAndType.find(item => item.category === chartType);
    return new Promise(resolve => {
      this.performanceRestService
        // .getNetworkLeversData(this.session.providerKeyData(), getStaticData.apiPoint, this.requestBody)
        .getNetworkLeversData(958, pageName, 'hco', this.requestBody)
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
                timeperiod:
                  'YTD (' +
                  this.common.dateFormat(response[0].ReportStartDate) +
                  '&ndash;' +
                  this.common.dateFormat(response[0].ReportEndDate) +
                  ')'
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
