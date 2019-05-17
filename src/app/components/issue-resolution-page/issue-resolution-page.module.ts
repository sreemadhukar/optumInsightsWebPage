import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueResolutionPageRoutingModule } from './issue-resolution-page-routing.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { SelfServiceComponent } from './self-service/self-service.component';
import { SelfServiceService } from '../../rest/issue-resolution/self-service.service';
import { SelfSharedService } from '../../shared/issue-resolution/self-shared.service';
@NgModule({
  imports: [CommonModule, IssueResolutionPageRoutingModule, CommonUtilsModule],
  providers: [SelfSharedService, SelfServiceService],
  declarations: [SelfServiceComponent]
})
export class IssueResolutionPageModule {}
