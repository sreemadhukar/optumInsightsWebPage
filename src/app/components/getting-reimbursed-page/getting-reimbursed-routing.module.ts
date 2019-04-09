import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';

const routes: Routes = [{ path: 'summary', component: GettingReimbursedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GettingReimbursedRoutingModule {}
