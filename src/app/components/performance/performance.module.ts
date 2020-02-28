import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { SummaryComponent } from './summary/summary.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { LabsComponent } from './labs/labs.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { RlpCommonUtilsModule } from './rlp-common-utils/rlp-common-utils.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, PerformanceRoutingModule, RlpCommonUtilsModule, CommonUtilsModule],
  declarations: [SummaryComponent, ReferralsComponent, LabsComponent, PrescriptionsComponent]
})
export class PerformanceModule {}
