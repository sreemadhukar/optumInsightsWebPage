import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareDeliveryPageRoutingModule } from './care-delivery-page-routing.module';
import { PriorAuthComponent } from './prior-auth/prior-auth.component';
import { CommonUtilsModule } from '../../common-utils/common-utils.module';
import { PatientCareOpportunityComponent } from './patient-care-opportunity/patient-care-opportunity.component';
import { PcorSharedService } from '../../shared/care-delivery/pcor-shared.service';
import { PriorAuthSharedService } from '../../shared/care-delivery/prior-auth-shared.service';
import { HeadMaterialModule } from 'src/app/head/head.material.module';
import { PcorModalComponent } from './pcor-modal/pcor-modal.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, CareDeliveryPageRoutingModule, HeadMaterialModule, CommonUtilsModule, MatDialogModule],
  providers: [PriorAuthSharedService, PcorSharedService],
  declarations: [PriorAuthComponent, PatientCareOpportunityComponent, PcorModalComponent],
  exports: [PriorAuthComponent, PatientCareOpportunityComponent],
  entryComponents: [PcorModalComponent]
})
export class CareDeliveryPageModule {
  constructor() {}
}
