import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';
import { SessionService } from '../session.service';
import { Subscription } from 'rxjs';

export interface ItableData {
  tin: string;
  groupName: string;
  graphData: any;
}

@Injectable({
  providedIn: 'root'
})
export class RlpSharedService {
  public requestBody;
  unGetTableData$: Subscription;
  constructor(private performanceRestService: PerformanceRestService, private session: SessionService) {
    this.requestBody = { timeFilter: 'YTD' };
  }

  /**
   * getTableShared function prepares the template for the table
   * @param pageName  pageName is the paramter required to map the enpoint corresponding to that page
   */

  public getTableShared(pageName) {
    return new Promise(resolve => {
      // this.performanceRestService.getNetworkLeversData(this.session.providerKeyData(), getEndpoint, this.requestBody).subscribe(
      this.unGetTableData$ = this.performanceRestService
        .getNetworkLeversData(this.session.providerKeyData(), pageName, 'tin', this.requestBody)
        .subscribe(
          response => {
            const newData = response.map(item => {
              const temp: ItableData = {
                tin: item.FormattedTin,
                groupName: item.TinName ? item.TinName : '',
                graphData: {
                  category: 'app-table-card',
                  type: 'rlp-table-bar',
                  data: {
                    gdata: {
                      count:
                        this.numberFormatting(item.Numerator.toFixed(0)) +
                        '/' +
                        this.numberFormatting(item.Denominator.toFixed(0)),
                      percentage: [item.RateWithPercentage],
                      color: ['#3381FF', '#E0E0E0'],
                      baseLine: 0
                    }
                  }
                }
              };
              return temp;
            });
            resolve(newData);
          },
          err => {
            console.log('Error in table data for', pageName, err);
          }
        );
    });
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

  unGetTable() {
    this.unGetTableData$.unsubscribe();
  }
}
