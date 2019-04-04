import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule, CommonUtilsModule],
  declarations: [OverviewComponent]
})
export class OverviewPageModule {}
