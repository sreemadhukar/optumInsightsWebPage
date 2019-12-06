import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintRoutingModule } from './print-routing.module';
import { PrintPageComponent } from './print-page/print-page.component';
import { OverviewPageModule } from './../overview-page/overview-page.module';
import { GettingReimbursedModule } from './../getting-reimbursed-page/getting-reimbursed.module';
import { ServiceInteractionModule } from './../service-interaction/service-interaction.module';
import { CareDeliveryPageModule } from './../care-delivery-page/care-delivery-page.module';

@NgModule({
  imports: [
    CommonModule,
    PrintRoutingModule,
    GettingReimbursedModule,
    OverviewPageModule,
    CareDeliveryPageModule,
    ServiceInteractionModule
  ],
  declarations: [PrintPageComponent]
})
export class PrintModule {}
