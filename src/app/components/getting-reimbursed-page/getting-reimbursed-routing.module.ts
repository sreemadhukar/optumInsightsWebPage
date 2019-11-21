import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';
import { AppealsComponent } from './appeals/appeals.component';
import { PaymentIntegrityComponent } from './payment-integrity/payment-integrity.component';
import { NonPaymentsComponent } from './non-payments/non-payments.component';
import { PaymentsComponent } from './payments/payments.component';
import { SmartEditsComponent } from './payment-integrity/smart-edits/smart-edits.component';
const routes: Routes = [
  {
    path: '',
    component: GettingReimbursedComponent,
    data: {
      breadcrumb: 'Summary'
    }
  },
  {
    path: 'Payments',
    component: PaymentsComponent,
    data: {
      breadcrumb: 'Payments'
    }
  },
  {
    path: 'NonPayments',
    component: NonPaymentsComponent,
    data: {
      breadcrumb: 'Non Payments'
    }
  },
  {
    path: 'Appeals',
    component: AppealsComponent,
    data: {
      breadcrumb: 'Appeals'
    }
  },
  {
    path: 'PaymentIntegrity',
    component: PaymentIntegrityComponent,
    data: {
      breadcrumb: 'Medical Records Coding Review'
    }
  },
  {
    path: 'SmartEdits',
    component: SmartEditsComponent,
    data: {
      breadcrumb: 'Payment Integrity'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GettingReimbursedRoutingModule {}
