import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueResolutionPageRoutingModule } from './issue-resolution-page-routing.module';
import { IssueResolutionComponent } from './issue-resolution/issue-resolution.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { SelfServiceComponent } from './self-service/self-service.component';

@NgModule({
  imports: [CommonModule, IssueResolutionPageRoutingModule, CommonUtilsModule],
  declarations: [IssueResolutionComponent, SelfServiceComponent]
})
export class IssueResolutionPageModule {}
