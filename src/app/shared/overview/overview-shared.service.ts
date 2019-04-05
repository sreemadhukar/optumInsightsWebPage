import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { ArrayType } from '@angular/compiler';

@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  private overviewPageData: ArrayType;
  constructor(private overviewService: OverviewService) {}
  public getOverviewData() {
    const tempArray: ArrayType;
    let cPriorAuth;
    // let cSelfService;
    // let cPcor;
    // let cIR;
    // let ssoppurtunities;
    this.overviewService.getOverviewDataJson().subscribe(data => {
      if (
        data[0].hasOwnProperty('PriorAuth') &&
        data[0].PriorAuth.hasOwnProperty('LineOfBusiness') &&
        data[0].PriorAuth.LineOfBusiness.hasOwnProperty('All') &&
        data[0].PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthApprovedCount') &&
        data[0].PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthNotApprovedCount') &&
        data[0].PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthPendingCount') &&
        data[0].PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthCancelledCount')
      ) {
        const priorAuthRequested =
          data[0].PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount +
          data[0].PriorAuth.LineOfBusiness.All.PriorAuthNotApprovedCount +
          data[0].PriorAuth.LineOfBusiness.All.PriorAuthPendingCount +
          data[0].PriorAuth.LineOfBusiness.All.PriorAuthCancelledCount;
        const approvedRate = data[0].PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount / priorAuthRequested;

        cPriorAuth = [
          {
            category: 'card',
            type: 'donut',
            data: {
              title: 'Prior Authorization Approval',
              cData: (approvedRate * 100).toFixed(1) + '%',
              arrow: 'uparrow',
              timeperiod: 'Rolling 12 Months'
            }
          }
        ];
      } else {
        cPriorAuth = [{ category: 'card', type: 'donut', data: null }];
      }
    });
    return this.overviewPageData;
  }
}
