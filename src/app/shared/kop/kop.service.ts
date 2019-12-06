import { Injectable } from '@angular/core';
import { KopService } from 'src/app/rest/kop/kop.service';
import { NPSSummary } from './kop.class.nps';
import { CareDelivery } from './kop.class.caredelivery';
import { NetworkParticipation } from './kop.class.networkparticipation';
import { TimePeriod } from './kop.class.timeperiod';
import { IssueResolution } from './kop.class.issueresolution';
import { Reimbursement } from './kop.class.reimbursement';
import { Engagement } from './kop.class.engagement';

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

      this.getKopData('kop', paramsArray).then((response: any) => {
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

        const engagementInstance = new Engagement({ records: response });
        const engagement = engagementInstance.getData();

        return resolve({
          npsSummary,
          timePeriod,
          careDelivery,
          networkParticipation,
          issueResolution,
          reimbursement,
          engagement
        });
      });
    });
  }

  public getPriorAuthSummary(params: any) {
    return new Promise((resolve, reject) => {
      const { filter: selectedFilter } = params;
      const { priorAuthFilters } = selectedFilter;

      const paramsArray = priorAuthFilters.map((param: string) => {
        return { filter: param };
      });

      const tasks = [this.getKopData('priorauthtat', paramsArray), this.getKopData('priorauth', paramsArray)];

      Promise.all(tasks)
        .then((response: any) => {
          if (!response || response.length === 0) {
            return resolve(null);
          }

          // Merging two responses in to one response
          const priorAuthResponse = [];
          const [priorAuthTATResponse, priorAuthVolumeResponse] = response;
          const noOfMetrics = priorAuthTATResponse.length || priorAuthVolumeResponse.length;
          for (let i = 0; i < noOfMetrics; i++) {
            priorAuthResponse[i] = priorAuthTATResponse[i];
            Object.assign(priorAuthResponse[i].CareDelivery, priorAuthVolumeResponse[i].CareDelivery);
          }

          for (let i = 0; i < priorAuthResponse.length; i++) {
            const {
              CareDelivery: {
                PriorAuthTAT: { PriorAuthTATValue },
                PriorAuthRequested: { PriorAuthRequestedValue }
              }
            } = priorAuthResponse[i];
            priorAuthResponse[i].CareDelivery.PriorAuthTAT.PriorAuthTATValue =
              PriorAuthTATValue / PriorAuthRequestedValue;
          }

          const careDeliveryInstance = new CareDelivery({ records: priorAuthResponse });
          const careDelivery = careDeliveryInstance.getData();

          return resolve({
            careDelivery
          });
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  public getPriorAuthTATSummary(params: any) {
    return new Promise(resolve => {
      const { filter: selectedFilter } = params;
      const { priorAuthFilters } = selectedFilter;

      const paramsArray = priorAuthFilters.map((param: string) => {
        return { filter: param };
      });

      this.getKopData('priorauthtat', paramsArray).then((response: any) => {
        if (!response || response.length === 0) {
          return resolve(null);
        }

        const careDeliveryInstance = new CareDelivery({ records: response });
        const careDelivery = careDeliveryInstance.getData();

        return resolve({
          careDelivery
        });
      });
    });
  }

  private getDataKopAsync(params: any, merticKey: string) {
    return new Promise((resolve, reject) => {
      if (merticKey === 'kop') {
        this.kopService.getSummary({ params }).subscribe(
          (response: any) => resolve(response),
          () => reject()
        );
      } else if (merticKey === 'priorauth') {
        this.kopService.getPriorAuthSummary({ params }).subscribe(
          (response: any) => resolve(response),
          () => reject()
        );
      } else if (merticKey === 'priorauthtat') {
        this.kopService.getPriorAuthTATSummary({ params }).subscribe(
          (response: any) => resolve(response),
          () => reject()
        );
      }
    });
  }

  private getKopData(merticKey: string, paramsArray: any[]) {
    return new Promise(resolve => {
      const tasks = [];

      paramsArray.forEach((paramsItem: any) => {
        tasks.push(this.getDataKopAsync(paramsItem, merticKey));
      });

      Promise.all(tasks)
        .then((response: any) => {
          const totalResponse = [];
          response.forEach((responseItem: any) => {
            if (responseItem) {
              responseItem.forEach((innerResponseItem: any) => {
                totalResponse.push(innerResponseItem);
              });
            }
          });
          return resolve(totalResponse);
        })
        .catch(() => {
          return resolve([]);
        });
    });
  }
}
