import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewAdvocateComponent } from './overview-advocate/overview-advocate.component';

const routes: Routes = [{ path: '', component: OverviewAdvocateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvocateRoutingModule {}
