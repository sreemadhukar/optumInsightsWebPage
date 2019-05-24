import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';
import { PatientCareOpportunityComponent } from './patient-care-opportunity/patient-care-opportunity.component';
const routes: Routes = [
  {
    path: 'priorAuth',
    component: PriorAuthComponent,
    data: {
      breadcrumb: 'Prior Authorizations'
    }
  },
  {
    path: 'PatientCareOpportunity',
    component: PatientCareOpportunityComponent,
    data: {
      breadcrumb: 'Patient Care Opportunity'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareDeliveryPageRoutingModule {}
