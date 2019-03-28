import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  imports: [
    CommonModule,
    OverviewPageRoutingModule
  ],
  declarations: [OverviewComponent]
})
export class OverviewPageModule {
}
