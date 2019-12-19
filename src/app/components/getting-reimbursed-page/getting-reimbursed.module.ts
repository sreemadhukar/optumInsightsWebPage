import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GettingReimbursedRoutingModule } from './getting-reimbursed-routing.module';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { HeadMaterialModule } from 'src/app/head/head.material.module';

import { PaymentsSharedService } from '../../shared/getting-reimbursed/payments/payments-shared.service';
import { NonPaymentSharedService } from '../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';

import { AppealsComponent } from './appeals/appeals.component';
import { AppealsSharedService } from '../../shared/getting-reimbursed/appeals/appeals-shared.service';
import { PaymentIntegrityComponent } from './payment-integrity/payment-integrity.component';
import { NonPaymentsComponent } from './non-payments/non-payments.component';
import { PaymentsComponent } from './payments/payments.component';
import { SmartEditsComponent } from './payment-integrity/smart-edits/smart-edits.component';
@NgModule({
  imports: [CommonModule, GettingReimbursedRoutingModule, CommonUtilsModule, HeadMaterialModule, FormsModule],
  providers: [GettingReimbursedService, NonPaymentSharedService, AppealsSharedService, PaymentsSharedService],

  declarations: [
    GettingReimbursedComponent,
    AppealsComponent,
    PaymentIntegrityComponent,
    NonPaymentsComponent,
    PaymentsComponent,
    SmartEditsComponent
  ],
  exports: [
    GettingReimbursedComponent,
    PaymentsComponent,
    NonPaymentsComponent,
    AppealsComponent,
    PaymentIntegrityComponent
  ]
})
export class GettingReimbursedModule {
  constructor() {
    console.log('GettingReimbursed Loaded');
  }
}
