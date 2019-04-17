import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewPageRoutingModule } from './overview-page-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewSharedService } from '../../shared/overview/overview-shared.service';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  imports: [CommonModule, OverviewPageRoutingModule, CommonUtilsModule, TooltipModule],
  providers: [OverviewService, OverviewSharedService],
  declarations: [OverviewComponent]
})
export class OverviewPageModule {}
