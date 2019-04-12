import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareDeliveryPageRoutingModule } from './care-delivery-page-routing.module';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';

@NgModule({
  imports: [CommonModule, CareDeliveryPageRoutingModule],
  declarations: [PriorAuthComponent]
})
export class CareDeliveryPageModule {}
