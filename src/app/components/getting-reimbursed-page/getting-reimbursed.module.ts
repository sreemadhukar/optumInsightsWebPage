import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GettingReimbursedRoutingModule } from './getting-reimbursed-routing.module';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
@NgModule({
  imports: [CommonModule, GettingReimbursedRoutingModule, CommonUtilsModule],
  declarations: [GettingReimbursedComponent]
})
export class GettingReimbursedModule {}
