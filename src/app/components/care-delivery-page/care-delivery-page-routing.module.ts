import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';

const routes: Routes = [
  {
    path: 'priorAuth',
    component: PriorAuthComponent,
    data: {
      breadcrumb: 'Prior Auth'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareDeliveryPageRoutingModule {}
