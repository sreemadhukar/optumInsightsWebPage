import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KnowOurProviderRoutingModule } from './know-our-provider-routing.module';
import { CommonUtilsModule } from 'src/app/common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, KnowOurProviderRoutingModule, CommonUtilsModule],
  declarations: [KopOverviewComponent]
})
export class KnowOurProviderModule {}
