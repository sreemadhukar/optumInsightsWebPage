import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelfServiceComponent } from './self-service/self-service.component';
import { CallsComponent } from './calls/calls.component';

const routes: Routes = [
  { path: 'SelfService', component: SelfServiceComponent, data: { breadcrumb: 'Self Service' } },
  { path: 'Calls', component: CallsComponent, data: { breadcrumb: 'Calls' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueResolutionPageRoutingModule {}
