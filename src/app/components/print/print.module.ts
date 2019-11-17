import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintRoutingModule } from './print-routing.module';
import { PrintPageComponent } from './print-page/print-page.component';
import { GettingReimbursedModule } from './../getting-reimbursed-page/getting-reimbursed.module';
@NgModule({
  imports: [CommonModule, PrintRoutingModule, GettingReimbursedModule],
  declarations: [PrintPageComponent]
})
export class PrintModule {}
