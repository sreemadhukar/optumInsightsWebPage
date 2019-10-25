import { Injectable } from '@angular/core';
import { KopService } from 'src/app/rest/kop/kop.service';
import { NPSSummary } from './kop.class.nps';
import { CareDelivery } from './kop.class.caredelivery';
import { NetworkParticipation } from './kop.class.networkparticipation';
import { TimePeriod } from './kop.class.timeperiod';
import { IssueResolution } from './kop.class.issueresolution';

@Injectable({
  providedIn: 'root'
})
export class KOPSharedService {
  filters: any = [
    {
      title: 'Last Completed Quarter',
      selected: true,
      quarterFormat: 'default',
      timeFrameFormat: 'Quarter and Year',
      filters: ['LAST_COMPLETED_QUARTER']
    },
    {
      title: 'Year To Date',
      selected: false,
      timeFrameFormat: 'Year',
      quarterFormat: 'default',
      filters: ['YEAR_TO_DATE']
    },
    {
      title: 'Quarter over Quarter',
      selected: false,
      timeFrameFormat: 'Quarter vs Quarter',
      quarterFormat: 'default',
      filters: ['QUARTER_OVER_QUARTER']
    },
    {
      title: 'Total Last Year',
      selected: false,
      timeFrameFormat: 'Last Year',
      quarterFormat: 'YTD',
      filters: ['YEAR_TO_DATE', 'TOTAL_LAST_YEAR']
    }
  ];
  constructor(private kopService: KopService) {}

  public getSummary(params: any, callback: any) {
    const { filter: selectedFilter } = params;
    const { filters, quarterFormat, timeFrameFormat, title } = selectedFilter;

    const paramsArray = filters.map((param: string) => {
      return { filter: param };
    });

    this.getKopData(paramsArray, (response: any) => {
      if (!response || response.length === 0) {
        return callback(null);
      }

      const timePeriodInstance = new TimePeriod({ records: response, title, quarterFormat, timeFrameFormat });
      const timePeriod = timePeriodInstance.getData();

      const npsSummaryInstance = new NPSSummary({ records: response });
      const npsSummary = npsSummaryInstance.getData();

      const careDeliveryInstance = new CareDelivery({ records: response });
      const careDelivery = careDeliveryInstance.getData();

      const networkParticipationInstance = new NetworkParticipation({ records: response });
      const networkParticipation = networkParticipationInstance.getData();

      const issueResolutionInstance = new IssueResolution({ records: response });
      const issueResolution = issueResolutionInstance.getData();

      return callback({ npsSummary, timePeriod, careDelivery, networkParticipation, issueResolution });
    });
  }

  private getKopData(paramsArray: any[], callback: any) {
    const tasks = [];

    const getDataAsync = (params: any) =>
      new Promise(resolve => {
        this.kopService.getSummary({ params }).subscribe((response: any) => resolve(response), () => resolve(null));
      });
    paramsArray.forEach((paramsItem: any) => {
      tasks.push(getDataAsync(paramsItem));
    });
    Promise.all(tasks).then((response: any) => {
      const totalResponse = [];
      response.forEach((responseItem: any) => {
        if (responseItem) {
          responseItem.forEach((innerResponseItem: any) => {
            totalResponse.push(innerResponseItem);
          });
        }
      });
      callback(totalResponse);
    });
  }
}
