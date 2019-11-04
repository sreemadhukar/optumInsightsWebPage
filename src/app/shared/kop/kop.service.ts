import { Injectable } from '@angular/core';
import { KopService } from 'src/app/rest/kop/kop.service';
import { NPSSummary } from './kop.class.nps';
import { CareDelivery } from './kop.class.caredelivery';
import { NetworkParticipation } from './kop.class.networkparticipation';
import { TimePeriod } from './kop.class.timeperiod';
import { IssueResolution } from './kop.class.issueresolution';
import { Reimbursement } from './kop.class.reimbursement';

@Injectable({
  providedIn: 'root'
})
export class KOPSharedService {
  constructor(private kopService: KopService) {}

  public getSummary(params: any) {
    return new Promise(resolve => {
      const { filter: selectedFilter } = params;
      const { filters, quarterFormat, timeFrameFormat, title } = selectedFilter;

      const paramsArray = filters.map((param: string) => {
        return { filter: param };
      });

      this.getKopData(paramsArray).then((response: any) => {
        if (!response || response.length === 0) {
          return resolve(null);
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

        const reimbursementInstance = new Reimbursement({ records: response });
        const reimbursement = reimbursementInstance.getData();

        return resolve({ npsSummary, timePeriod, careDelivery, networkParticipation, issueResolution, reimbursement });
      });
    });
  }

  private getDataAsync(params: any) {
    return new Promise(resolve => {
      this.kopService.getSummary({ params }).subscribe((response: any) => resolve(response), () => resolve(null));
    });
  }

  private getKopData(paramsArray: any[]) {
    return new Promise(resolve => {
      const tasks = [];

      paramsArray.forEach((paramsItem: any) => {
        tasks.push(this.getDataAsync(paramsItem));
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
        return resolve(totalResponse);
      });
    });
  }
}
