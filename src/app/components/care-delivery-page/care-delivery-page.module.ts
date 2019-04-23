import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareDeliveryPageRoutingModule } from './care-delivery-page-routing.module';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';
import { CommonUtilsModule } from '../../common-utils/common-utils.module';
@NgModule({
  imports: [CommonModule, CareDeliveryPageRoutingModule, CommonUtilsModule],
  declarations: [PriorAuthComponent]
})
export class CareDeliveryPageModule {}
