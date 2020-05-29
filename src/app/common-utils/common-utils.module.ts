import { ModalPopupService } from './modal-popup/modal-popup.service';
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
import { LargeCardComponent } from './large-card/large-card.component';
import { RotatingArrowObjectComponent } from './d3-objects/rotating-arrow-object/rotating-arrow-object.component';
import { ClaimsPaidBarGraphComponent } from './d3-objects/claims-paid-bar-graph/claims-paid-bar-graph.component';
import { ProviderSearchComponent } from './provider-search/provider-search.component';
import { ErrorCardComponent } from './error-card/error-card.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { SmallBarChartComponent } from './d3-objects/small-bar-chart/small-bar-chart.component';
import { UhcLoaderComponent } from './uhc-loader/uhc-loader.component';
import { MockDataWarningMessageComponent } from './mock-data-warning-message/mock-data-warning-message.component';
import { LineGraphComponent } from './d3-objects/line-graph/line-graph.component';
import { HighlightPipe } from '../pipes/hignlight.pipe';
import { FilterComponent } from './filter/filter.component';
import { MedBarChartComponent } from './d3-objects/med-bar-chart/med-bar-chart.component';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { DonutChartOnchangeComponent } from './d3-objects/donut-chart-onchange/donut-chart-onchange.component';
import { MatIconModule } from '@angular/material';
import { PrintComponent } from './print/print.component';
import { ClarifyClaimsMessageComponent } from './clarify-claims-message/clarify-claims-message.component';
import { AccordionLargeCardComponent } from './accordion-large-card/accordion-large-card.component';
import { D3StarBlueComponent } from './d3-objects/d3-star-blue/d3-star-blue.component';
import { D3StarGreyComponent } from './d3-objects/d3-star-grey/d3-star-grey.component';
import { HeacSmallCardComponent } from './heac-small-card/heac-small-card.component';
import { PipesModule } from '../pipes/pipes.module';
import { LargeCardKopComponent } from './large-card-kop/large-card-kop.component';
import { TrendsComponent } from './trends/trends.component';
import { DonutChartsComponent } from './kop-cards/donut-charts/donut-charts.component';
import { HorizontalChartsComponent } from './kop-cards/horizontal-charts/horizontal-charts.component';
import { VerticalBarChartsComponent } from './kop-cards/vertical-bar-charts/vertical-bar-charts.component';
import { KopFiltersComponent } from './kop-filters/kop-filters.component';
import { MultiLineGraphComponent } from './d3-objects/multi-line-graph/multi-line-graph.component';
import { ErrorTemplateComponent } from './kop-cards/error-template/error-template.component';
import { FiltersAppliedComponent } from './filters-applied/filters-applied.component';
import { FiltersMultiSelectComponent } from './filters-multi-select/filters-multi-select.component';
import { NoAccessErrorPageComponent } from './no-access-error-page/no-access-error-page.component';
import { ColorGreyMiniBarChartComponent } from './d3-objects/color-grey-mini-bar-chart/color-grey-mini-bar-chart.component';
import { BarSimplePiComponent } from './d3-objects/bar-simple-pi/bar-simple-pi.component';
import { StackedBarChartComponent } from './d3-objects/stacked-bar-chart/stacked-bar-chart.component';
import { UhcKopFilterComponent } from './uhc-kop-filter/uhc-kop-filter.component';
import { ClickElsewhereDirective } from './directives/ClickElsewhereDirective';

import { RlpCommonUtilsModule } from '../components/performance/rlp-common-utils/rlp-common-utils.module';
import { RlpLongCardComponent } from './rlp-long-card/rlp-long-card.component';
import { LayoutContainerComponent } from './_layouts/layout_container/layoutcontainer.component';
import { LayoutSeparatorComponent } from './_layouts/layout_seperator/layout_seperator.component';
import { PageHeaderComponent } from './_headers/page_header/page_header.component';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeadMaterialModule,
    RouterModule,
    MatIconModule,
    PipesModule,
    RlpCommonUtilsModule
  ],
  exports: [
    LayoutContainerComponent,
    LayoutSeparatorComponent,
    PageHeaderComponent,
    MiniTileComponent,
    CardComponent,
    CommonFooterComponent,
    CommonHeaderComponent,
    SmallCardComponent,
    BarChartComponent,
    BreadcrumbsComponent,
    LargeCardComponent,
    ErrorCardComponent,
    GlossaryComponent,
    SmallBarChartComponent,
    ProviderSearchComponent,
    UhcLoaderComponent,
    ClaimsPaidBarGraphComponent,
    MockDataWarningMessageComponent,
    LineGraphComponent,
    HighlightPipe,
    FilterComponent,
    MedBarChartComponent,
    DonutChartComponent,
    PrintComponent,
    ClarifyClaimsMessageComponent,
    AccordionLargeCardComponent,
    HeacSmallCardComponent,
    LargeCardKopComponent,
    TrendsComponent,
    DonutChartsComponent,
    HorizontalChartsComponent,
    VerticalBarChartsComponent,
    KopFiltersComponent,
    MultiLineGraphComponent,
    FiltersAppliedComponent,
    MultiSelectComponent,
    FiltersMultiSelectComponent,
    ColorGreyMiniBarChartComponent,
    BarSimplePiComponent,
    UhcKopFilterComponent,
    StackedBarChartComponent,
    ClickElsewhereDirective,
    RlpLongCardComponent
  ],
  declarations: [
    LayoutContainerComponent,
    LayoutSeparatorComponent,
    PageHeaderComponent,
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
    LargeCardComponent,
    RotatingArrowObjectComponent,
    ClaimsPaidBarGraphComponent,
    ProviderSearchComponent,
    ErrorCardComponent,
    GlossaryComponent,
    SmallBarChartComponent,
    UhcLoaderComponent,
    MockDataWarningMessageComponent,
    LineGraphComponent,
    HighlightPipe,
    FilterComponent,
    MedBarChartComponent,
    MultiSelectComponent,
    DonutChartOnchangeComponent,
    PrintComponent,
    ClarifyClaimsMessageComponent,
    AccordionLargeCardComponent,
    D3StarBlueComponent,
    D3StarGreyComponent,
    HeacSmallCardComponent,
    LargeCardKopComponent,
    TrendsComponent,
    DonutChartsComponent,
    HorizontalChartsComponent,
    VerticalBarChartsComponent,
    KopFiltersComponent,
    MultiLineGraphComponent,
    ErrorTemplateComponent,
    FiltersAppliedComponent,
    FiltersMultiSelectComponent,
    NoAccessErrorPageComponent,
    ColorGreyMiniBarChartComponent,
    BarSimplePiComponent,
    StackedBarChartComponent,
    UhcKopFilterComponent,
    ClickElsewhereDirective,
    RlpLongCardComponent,
    ModalPopupComponent
  ],
  entryComponents: [ProviderSearchComponent, ModalPopupComponent],
  providers: [ModalPopupService]
})
export class CommonUtilsModule {}
