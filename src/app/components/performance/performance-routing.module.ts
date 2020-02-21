import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { LabsComponent } from './labs/labs.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';

const routes: Routes = [
  { path: '', component: SummaryComponent },
  { path: 'Referrals', component: ReferralsComponent },
  { path: 'Labs', component: LabsComponent },
  { path: 'Prescriptions', component: PrescriptionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule {}
