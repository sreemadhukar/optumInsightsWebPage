import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueResolutionPageRoutingModule } from './issue-resolution-page-routing.module';
import { IssueResolutionComponent } from './issue-resolution/issue-resolution.component';

@NgModule({
  imports: [CommonModule, IssueResolutionPageRoutingModule],
  declarations: [IssueResolutionComponent]
})
export class IssueResolutionPageModule {}
