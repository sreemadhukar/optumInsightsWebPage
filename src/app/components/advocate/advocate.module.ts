import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { HeadMaterialModule } from 'src/app/head/head.material.module';
import { OverviewAdvocateComponent } from './overview-advocate/overview-advocate.component';
import { TopRowAdvOverviewComponent } from './top-row-adv-overview/top-row-adv-overview.component';
import { AdvocateRoutingModule } from './advocate-routing.module';
import { FilterAdvocateComponent } from './filter-advocate/filter-advocate.component';
import { TopRowAdvOverviewSharedService } from '../../shared/advocate/top-row-adv-overview-shared.service';
import { NonPaymentSharedService } from '../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { OverviewAdvocateSharedService } from '../../shared/advocate/overview-advocate-shared.service';
import { LargeCardAdvocateComponent } from './large-card-advocate/large-card-advocate.component';
import { HealthSystemDetailsComponent } from './health-system-details/health-system-details.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TaxSummaryComponent } from './tax-summary/tax-summary.component';

@NgModule({
  imports: [CommonModule, AdvocateRoutingModule, CommonUtilsModule, HeadMaterialModule, PipesModule],
  declarations: [
    OverviewAdvocateComponent,
    TopRowAdvOverviewComponent,
    FilterAdvocateComponent,
    LargeCardAdvocateComponent,
    HealthSystemDetailsComponent,
    TaxSummaryComponent
  ],
  providers: [TopRowAdvOverviewSharedService, NonPaymentSharedService, OverviewAdvocateSharedService]
})
export class AdvocateModule {
  constructor() {
    console.log('Advocate Loaded');
  }
}
