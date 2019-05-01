import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueResolutionPageRoutingModule } from './issue-resolution-page-routing.module';
import { IssueResolutionComponent } from './issue-resolution/issue-resolution.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, IssueResolutionPageRoutingModule, CommonUtilsModule],
  declarations: [IssueResolutionComponent]
})
export class IssueResolutionPageModule {}
