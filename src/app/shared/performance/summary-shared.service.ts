import { Injectable } from '@angular/core';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { rlpPageName, rlpCardType, rlpBarType } from '../../modals/rlp-data';
import { CommonUtilsService } from '../common-utils.service';
import { Subscription } from 'rxjs';

export const getCategoryAndType = [
  { category: rlpCardType.longCard, type: rlpBarType.longCard },
  { category: rlpCardType.appCard, type: rlpBarType.appCard }
];
export const pageMapApiEndpoint = [
  {
    name: rlpPageName.Referral,
    title: 'Preferred Specialist Referral Rate',
    suffix: 'Referrals'
  },
  {
    name: rlpPageName.Labs,
    title: 'Preferred Lab Network Use Rate',
    suffix: 'Preferred Lab Visits'
  },
  {
    name: rlpPageName.Perscription,
    title: 'Preferred Tier Prescribing Rate',
    suffix: 'Prescriptions'
  }
];
@Injectable({
  providedIn: 'root'
})
export class SummarySharedService {
  public requestBody: Object;
  public hcoData$: Subscription;
  constructor(
    private readonly MetricidService: GlossaryMetricidService,
    private readonly session: SessionService,
    private readonly toggle: AuthorizationService,
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
      this.hcoData$ = this.performanceRestService
        .getNetworkLeversData(this.session.providerKeyData(), pageName, 'hco', this.requestBody)
        .subscribe(
          response => {
            let newData = null;
            if (response) {
              newData = {
                category: getCandType.category,
                type: getCandType.type,
                title: getStaticData.title,
                toggle: this.toggle.setToggles(getStaticData.title, pageName, 'Performance', false),
                MetricID: this.MetricidService.MetricIDs[getStaticData.title.replace(/ +/g, '')],
                data: {
                  gdata: {
                    count:
                      this.numberFormatting(response[0].Numerator.toFixed(0)) +
                      '/' +
                      this.numberFormatting(response[0].Denominator.toFixed(0)) +
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
            resolve(newData);
          },
          err => {
            console.log('HCO Data Error', pageName, err);
          }
        );
    });
  }

  public unGetHCOdata() {
    this.hcoData$.unsubscribe();
  }
  numberFormatting(nStr) {
    nStr += '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
}
