import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewSharedService } from '../../shared/overview/overview-shared.service';
import { StarChartComponent } from '../../common-utils/d3-objects/star-chart/star-chart.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule, CommonUtilsModule],
  providers: [OverviewService, OverviewSharedService],
  declarations: [OverviewComponent, StarChartComponent]
})
export class OverviewPageModule {}
