import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewSharedService } from '../../shared/overview/overview-shared.service';
import { DonutChartComponent } from '../../common-utils/d3-objects/donut-chart/donut-chart.component';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule],
  providers: [OverviewService, OverviewSharedService],
  declarations: [OverviewComponent, DonutChartComponent]
})
export class OverviewPageModule {}
