import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { PerformanceRoutingModule } from './performance-routing.module';
import { SummaryComponent } from './summary/summary.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { LabsComponent } from './labs/labs.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { RlpCommonUtilsModule } from './rlp-common-utils/rlp-common-utils.module';
import { RlpSharedService } from '../../shared/performance/rlp-shared.service';
import { SummarySharedService } from '../../shared/performance/summary-shared.service';

@NgModule({
  imports: [CommonModule, PerformanceRoutingModule, RlpCommonUtilsModule, CommonUtilsModule],
  providers: [RlpSharedService, SummarySharedService],
  declarations: [SummaryComponent, ReferralsComponent, LabsComponent, PrescriptionsComponent]
})
export class PerformanceModule {}
