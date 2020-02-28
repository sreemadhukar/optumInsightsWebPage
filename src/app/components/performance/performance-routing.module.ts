import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { LabsComponent } from './labs/labs.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryComponent,
    data: {
      breadcrumb: 'Performance Management Summary'
    }
  },
  {
    path: 'Referrals',
    component: ReferralsComponent,
    data: {
      breadcrumb: 'Referrals'
    }
  },
  {
    path: 'Labs',
    component: LabsComponent,
    data: {
      breadcrumb: 'Labs'
    }
  },
  {
    path: 'Prescriptions',
    component: PrescriptionsComponent,
    data: {
      breadcrumb: 'Prescriptions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule {}
