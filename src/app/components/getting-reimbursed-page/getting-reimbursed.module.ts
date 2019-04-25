import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GettingReimbursedRoutingModule } from './getting-reimbursed-routing.module';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { HeadMaterialModule } from 'src/app/head/head.material.module';

import { GettingReimbursedSharedService } from '../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { GettingReimbursedService } from '../../rest/getting-reimbursed/getting-reimbursed.service';
@NgModule({
  imports: [CommonModule, GettingReimbursedRoutingModule, CommonUtilsModule, HeadMaterialModule],
  providers: [GettingReimbursedService, GettingReimbursedSharedService],

  declarations: [GettingReimbursedComponent]
})
export class GettingReimbursedModule {}
