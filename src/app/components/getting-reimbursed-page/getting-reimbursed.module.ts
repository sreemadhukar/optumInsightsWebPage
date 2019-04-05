import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GettingReimbursedRoutingModule } from './getting-reimbursed-routing.module';
import { GettingReimbursedComponent } from './getting-reimbursed/getting-reimbursed.component';

@NgModule({
  imports: [CommonModule, GettingReimbursedRoutingModule],
  declarations: [GettingReimbursedComponent]
})
export class GettingReimbursedModule {}
