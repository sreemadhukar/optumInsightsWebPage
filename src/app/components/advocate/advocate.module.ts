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
import { AdvocateHomeComponent } from './advocate-home/advocate-home.component';
import { DropdownComponent } from './advocate-home/dropdown/dropdown.component';
import { HomeService } from '../../rest/advocate/home.service';
/*** Search component */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
/** Search component ends here */
@NgModule({
  imports: [
    CommonModule,
    AdvocateRoutingModule,
    CommonUtilsModule,
    HeadMaterialModule,
    PipesModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  declarations: [
    OverviewAdvocateComponent,
    TopRowAdvOverviewComponent,
    FilterAdvocateComponent,
    LargeCardAdvocateComponent,
    HealthSystemDetailsComponent,
    TaxSummaryComponent,
    AdvocateHomeComponent,
    DropdownComponent
  ],
  providers: [TopRowAdvOverviewSharedService, NonPaymentSharedService, OverviewAdvocateSharedService, HomeService]
})
export class AdvocateModule {
  constructor() {
    console.log('Advocate Loaded');
  }
}
