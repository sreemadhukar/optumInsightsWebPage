import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewAdvocateComponent } from './overview-advocate/overview-advocate.component';
import { HealthSystemDetailsComponent } from './health-system-details/health-system-details.component';

const routes: Routes = [{ path: '', component: HealthSystemDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvocateRoutingModule {}
