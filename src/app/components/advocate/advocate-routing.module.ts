import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewAdvocateComponent } from './overview-advocate/overview-advocate.component';
import { HealthSystemDetailsComponent } from './health-system-details/health-system-details.component';
import { AdvocateHomeComponent } from './advocate-home/advocate-home.component';

const routes: Routes = [
  { path: '', component: OverviewAdvocateComponent },
  {
    path: 'HealthSystemDetails',
    component: HealthSystemDetailsComponent,
    data: {
      breadcrumb: 'Health System Details'
    }
  },
  {
    path: 'Home',
    component: AdvocateHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvocateRoutingModule {}
