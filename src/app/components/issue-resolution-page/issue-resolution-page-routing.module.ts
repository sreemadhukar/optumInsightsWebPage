import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueResolutionComponent } from './issue-resolution/issue-resolution.component';

const routes: Routes = [{ path: '', component: IssueResolutionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueResolutionPageRoutingModule {}
