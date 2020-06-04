import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfServiceComponent } from './self-service/self-service.component';
import { CallsComponent } from './calls/calls.component';
import { EdiSubmissionComponent } from './self-service/edi-submission/edi-submission.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Self Service' },
    children: [
      {
        path: 'SelfService',
        component: SelfServiceComponent,
        data: { breadcrumb: 'Summary' }
      },
      {
        path: 'EDI',
        component: EdiSubmissionComponent,
        data: { breadcrumb: 'EDI' }
      }
    ]
  },
  { path: 'Calls', component: CallsComponent, data: { breadcrumb: 'Calls' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceInteractionRoutingModule {}
