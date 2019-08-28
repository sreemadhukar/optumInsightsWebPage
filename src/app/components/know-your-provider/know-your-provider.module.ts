import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KnowYourProviderRoutingModule } from './know-your-provider-routing.module';

@NgModule({
  imports: [CommonModule, KnowYourProviderRoutingModule],
  declarations: [KopOverviewComponent]
})
export class KnowYourProviderModule {}
