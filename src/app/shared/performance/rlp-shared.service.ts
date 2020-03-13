import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { PerformanceModule } from '../../components/performance/performance.module';
import { rlpPageName } from '../../modals/rlp-data';

export interface ItableData {
  tin: number;
  groupName: string;
  graphData: any;
}
export const endpoints = {
  labs: 'LAB_VISITS_TIN',
  referral: 'SPECIALIST_REFERRAL_TIN',
  perscription: 'PRESCRIBING_PROVIDER_TIN'
};
export const pageMapApiEndpoint = [
  { name: rlpPageName.Referral, value: endpoints.referral },
  { name: rlpPageName.Labs, value: endpoints.labs },
  { name: rlpPageName.Perscription, value: endpoints.perscription }
];

@Injectable({
  providedIn: PerformanceModule
})
export class RlpSharedService {
  public requestBody;
  constructor(private performanceRestService: PerformanceRestService) {
    this.requestBody = { timeFilter: 'YTD' };
  }
  public getTableShared(pageName) {
    return new Promise(resolve => {
      const findEndpoint = pageMapApiEndpoint.filter(item => item.name === pageName).map(x => x.value)[0];
      // this.performanceRestService.getNetworkLeversData(this.session.providerKeyData(), findEndpoint, this.requestBody).subscribe(
      this.performanceRestService.getNetworkLeversData(1000, findEndpoint, this.requestBody).subscribe(
        response => {
          const newData = response.map(item => {
            const temp: ItableData = {
              tin: item.Tin,
              groupName: item.TinName,
              graphData: {
                category: 'app-table-card',
                type: 'rlp-table-bar',
                data: {
                  gdata: {
                    count: item.Numerator.toFixed(0) + '/' + item.Denominator.toFixed(0),
                    percentage: item.RateWithPercentage
                  }
                }
              }
            };
            return temp;
          });
          console.log('Response Table', pageName, response);
          console.log('New Table', pageName, newData);
          resolve(newData);
        },
        err => {
          console.log('Error in table data for', pageName, err);
        }
      );
    });
  }
}
