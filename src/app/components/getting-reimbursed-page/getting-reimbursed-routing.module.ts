import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';
import { AppealsComponent } from './appeals/appeals.component';
import { PaymentIntegrityComponent } from './payment-integrity/payment-integrity.component';

const routes: Routes = [
  {
    path: '',
    component: GettingReimbursedComponent,
    data: {
      breadcrumb: 'Summary'
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
      breadcrumb: 'Payment Integrity'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GettingReimbursedRoutingModule {}
