import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewSharedService } from '../../shared/overview/overview-shared.service';
import { HeadMaterialModule } from '../../head/head.material.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { CallsTrendService } from '../../shared/service-interaction/calls-trend.service';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule, HeadMaterialModule, CommonUtilsModule],
  providers: [OverviewService, OverviewSharedService, CallsTrendService],
  declarations: [OverviewComponent]
})
export class OverviewPageModule {}
