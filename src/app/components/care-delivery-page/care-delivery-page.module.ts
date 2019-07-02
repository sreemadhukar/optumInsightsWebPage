import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareDeliveryPageRoutingModule } from './care-delivery-page-routing.module';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';
import { CommonUtilsModule } from '../../common-utils/common-utils.module';
import { PatientCareOpportunityComponent } from './patient-care-opportunity/patient-care-opportunity.component';

import { PriorAuthService } from '../../rest/prior-auth/prior-auth.service';
import { PriorAuthSharedService } from '../../shared/prior-authorization/prior-auth.service';
import { HeadMaterialModule } from 'src/app/head/head.material.module';

@NgModule({
  imports: [CommonModule, CareDeliveryPageRoutingModule, HeadMaterialModule, CommonUtilsModule],
  providers: [PriorAuthService, PriorAuthSharedService],
  declarations: [PriorAuthComponent, PatientCareOpportunityComponent]
})
export class CareDeliveryPageModule {}
