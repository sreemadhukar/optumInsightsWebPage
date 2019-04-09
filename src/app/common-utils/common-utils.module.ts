import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniTileComponent } from './mini-tile/mini-tile.component';
import { CardComponent } from './card/card.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { CommonFooterComponent } from './common-footer/common-footer.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { MiniBarChartComponent } from './d3-objects/mini-bar-chart/mini-bar-chart.component';
import { DonutChartComponent } from './d3-objects/donut-chart/donut-chart.component';
import { StarChartComponent } from './d3-objects/star-chart/star-chart.component';

@NgModule({
  imports: [CommonModule],
  exports: [MiniTileComponent, CardComponent, CommonFooterComponent, CommonHeaderComponent, SmallCardComponent],
  declarations: [
    MiniTileComponent,
    CardComponent,
    CommonHeaderComponent,
    CommonFooterComponent,
    SmallCardComponent,
    MiniBarChartComponent,
    DonutChartComponent,
    StarChartComponent
  ]
})
export class CommonUtilsModule {}
