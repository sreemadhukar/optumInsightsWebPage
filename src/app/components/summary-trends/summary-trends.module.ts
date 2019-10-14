import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderTrendsComponent } from './provider-trends/provider-trends.component';
import { SummaryTrendsRoutingModule } from './summary-trends-routing.modue';
import { HeadMaterialModule } from 'src/app/head/head.material.module';
import { CommonUtilsModule } from 'src/app/common-utils/common-utils.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SummaryTrendsRoutingModule, HeadMaterialModule, CommonUtilsModule, FormsModule],
  declarations: [ProviderTrendsComponent]
})
export class SummaryTrendsModule {}
