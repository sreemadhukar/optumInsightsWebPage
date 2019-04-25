import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MiniTileComponent } from './mini-tile/mini-tile.component';
import { CardComponent } from './card/card.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { CommonFooterComponent } from './common-footer/common-footer.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { MiniBarChartComponent } from './d3-objects/mini-bar-chart/mini-bar-chart.component';
import { DonutChartComponent } from './d3-objects/donut-chart/donut-chart.component';
import { StarChartComponent } from './d3-objects/star-chart/star-chart.component';
import { BarChartComponent } from './d3-objects/bar-chart/bar-chart.component';
import { HeadMaterialModule } from '../head/head.material.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LargeCardComponent } from './large-card/large-card.component';
import { RotatingArrowObjectComponent } from './d3-objects/rotating-arrow-object/rotating-arrow-object.component';
import { ProviderSearchComponent } from './provider-search/provider-search.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeadMaterialModule, RouterModule],
  exports: [
    MiniTileComponent,
    CardComponent,
    CommonFooterComponent,
    CommonHeaderComponent,
    SmallCardComponent,
    BarChartComponent,
    BreadcrumbsComponent,
    FeedbackComponent,
    LargeCardComponent
  ],
  declarations: [
    MiniTileComponent,
    CardComponent,
    CommonHeaderComponent,
    CommonFooterComponent,
    SmallCardComponent,
    MiniBarChartComponent,
    DonutChartComponent,
    StarChartComponent,
    BarChartComponent,
    BreadcrumbsComponent,
    FeedbackComponent,
    LargeCardComponent,
    RotatingArrowObjectComponent,
    ProviderSearchComponent
  ],
  entryComponents: [ProviderSearchComponent]
})
export class CommonUtilsModule {}
