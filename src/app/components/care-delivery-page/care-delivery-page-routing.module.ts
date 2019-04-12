import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriorAuthComponent } from './prior-auth/prior-auth.component';

const routes: Routes = [{ path: 'priorAuth', component: PriorAuthComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareDeliveryPageRoutingModule {}
