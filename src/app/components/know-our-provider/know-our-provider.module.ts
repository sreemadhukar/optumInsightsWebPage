import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KnowOurProviderRoutingModule } from './know-our-provider-routing.module';
import { CommonUtilsModule } from 'src/app/common-utils/common-utils.module';
import { HeadMaterialModule } from 'src/app/head/head.material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [CommonModule, PipesModule, KnowOurProviderRoutingModule, HeadMaterialModule, CommonUtilsModule],
  declarations: [KopOverviewComponent]
})
export class KnowOurProviderModule {}
