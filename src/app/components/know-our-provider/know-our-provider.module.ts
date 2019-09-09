import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KnowOurProviderRoutingModule } from './know-our-provider-routing.module';

@NgModule({
  imports: [CommonModule, KnowOurProviderRoutingModule],
  declarations: [KopOverviewComponent]
})
export class KnowOurProviderModule {}
