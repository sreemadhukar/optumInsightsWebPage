import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniTileComponent } from './mini-tile/mini-tile.component';
import { StarChartComponent } from './d3-objects/star-chart/star-chart.component';

@NgModule({
  imports: [CommonModule],
  exports: [MiniTileComponent],
  declarations: [MiniTileComponent, StarChartComponent]
})
export class CommonUtilsModule {}
