import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';

@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  constructor(private overviewService: OverviewService) {}
  public getOverviewData() {
    this.overviewService.getOverviewDataJson().subscribe(data => {
      console.log(data);
      return data;
    });
  }
}
