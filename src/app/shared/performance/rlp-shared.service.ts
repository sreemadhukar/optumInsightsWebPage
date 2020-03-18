import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { PerformanceModule } from '../../components/performance/performance.module';

export interface ItableData {
  tin: string;
  groupName: string;
  graphData: any;
}

@Injectable({
  providedIn: PerformanceModule
})
export class RlpSharedService {
  public requestBody;
  constructor(private performanceRestService: PerformanceRestService) {
    this.requestBody = { timeFilter: 'YTD' };
  }

  /**
   * getTableShared function prepares the template for the table
   * @param pageName  pageName is the paramter required to map the enpoint corresponding to that page
   */

  public getTableShared(pageName) {
    return new Promise(resolve => {
      // this.performanceRestService.getNetworkLeversData(this.session.providerKeyData(), getEndpoint, this.requestBody).subscribe(
      this.performanceRestService.getNetworkLeversData(958, pageName, 'tin', this.requestBody).subscribe(
        response => {
          console.log('response--->', response);
          const newData = response.map(item => {
            const temp: ItableData = {
              tin: item.Tin.toFixed(0),
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
