import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueResolutionComponent } from './issue-resolution/issue-resolution.component';
import { SelfServiceComponent } from './self-service/self-service.component';

const routes: Routes = [
  { path: '', component: IssueResolutionComponent, data: { breadcrumb: 'Issue Resolution' } },
  { path: 'SelfService', component: SelfServiceComponent, data: { breadcrumb: 'Self Service' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueResolutionPageRoutingModule {}
