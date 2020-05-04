import { Injectable } from '@angular/core';
import { KopService } from 'src/app/rest/kop/kop.service';
import { NPSSummary } from './kop.class.nps';
import { CareDelivery } from './kop.class.caredelivery';
import { NetworkParticipation } from './kop.class.networkparticipation';
import { TimePeriod } from './kop.class.timeperiod';
import { IssueResolution } from './kop.class.issueresolution';
import { Reimbursement } from './kop.class.reimbursement';
import { Engagement } from './kop.class.engagement';
import { NPSDetail } from './detail/nps/kop.class.nps-detail';

@Injectable({
  providedIn: 'root'
})
export class KOPSharedService {
  constructor(private kopService: KopService) {}

  public getNpsDetails() {
    return new Promise(resolve => {
      this.kopService.getNpsDetailSummary({ params: {} }).subscribe(
        (response: any) => {
          if (!response || response.length === 0) {
            return resolve(null);
          }

          const timePeriod = {
            title: 'Quarter over Quarter,',
            timeFrame: {
              quarters: ['4', '4'],
              type: 'summary',
              format: 'Quarter vs Quarter',
              years: []
            }
          };

          const npsDetailInstance = new NPSDetail({ records: response, small: false, id: 'npsCombined' });
          const npsData = npsDetailInstance.getData();

          timePeriod.timeFrame.years = npsData.quarters.map((quarter: any) => quarter.year);

          // const npsDetailInstancePM = new NPSDetail({ records: response, small: true, id: 'npsPM' });
          // const npsDataPM = npsDetailInstancePM.getData();

          // const npsDetailInstanceMD = new NPSDetail({ records: response, small: true, id: 'npsMd' });
          // const npsDataMD = npsDetailInstanceMD.getData();

          return resolve({
            npsData,
            // npsDataMD,
            // npsDataPM,
            timePeriod
          });
        },
        () => {
          return resolve(null);
        }
      );
    });
  }

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

        const reimbursementInstance = new Reimbursement({ records: response, key: 'Reimbursement' });
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

  public getClaimsData(params: any) {
    return new Promise(resolve => {
      const { filter: selectedFilter } = params;
      const { priorAuthFilters } = selectedFilter;
      const paramsArray = priorAuthFilters.map((param: string) => {
        return { filter: param };
      });
      this.getKopData('reimbursementClaims', paramsArray).then((response: any) => {
        if (!response || response.length === 0) {
          return resolve(null);
        } else {
          const reimbursementInstance = new Reimbursement({ records: response, key: 'ReimbursementClaims' });
          const reimbursement = reimbursementInstance.getData();
          return resolve({
            reimbursement
          });
        }
      });
    });
  }

  private getDataKopAsync(params: any, metricKey: string) {
    return new Promise((resolve, reject) => {
      switch (metricKey) {
        case 'kop':
          this.kopService.getSummary({ params }).subscribe((response: any) => resolve(response), () => reject());
          break;
        case 'priorauthtat':
          this.kopService
            .getPriorAuthTATSummary({ params })
            .subscribe((response: any) => resolve(response), () => reject());
          break;
        case 'reimbursementClaims':
          Object.assign(params, { region: 'LEASED MARKETS', markets: ['MINNEAPOLIS, MN', 'CHICAGO, IL'] });
          this.kopService.getClaimsData({ params }).subscribe((response: any) => resolve(response), () => reject());
          break;
      }
    });
  }

  private getKopData(metricKey: string, paramsArray: any[]) {
    return new Promise(resolve => {
      const tasks = [];

      paramsArray.forEach((paramsItem: any) => {
        tasks.push(this.getDataKopAsync(paramsItem, metricKey));
      });

      Promise.all(tasks)
        .then((response: any) => {
          const totalResponse = [];
          response.forEach((responseItem: any) => {
            if (responseItem && responseItem instanceof Array && responseItem.length > 0) {
              responseItem.forEach((innerResponseItem: any) => {
                totalResponse.push(innerResponseItem);
              });
            } else {
              return resolve([]);
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
