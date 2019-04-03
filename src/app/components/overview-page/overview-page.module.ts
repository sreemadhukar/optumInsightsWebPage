import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { DonutChartComponent } from '../../common-utils/d3-objects/donut-chart/donut-chart.component';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule],
  declarations: [OverviewComponent, DonutChartComponent]
})
export class OverviewPageModule {}
