import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceInteractionRoutingModule } from './service-interaction-routing.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { SelfServiceComponent } from './self-service/self-service.component';
import { SelfServiceService } from '../../rest/service-interaction/self-service.service';
import { SelfSharedService } from '../../shared/service-interaction/self-shared.service';
import { CallsComponent } from './calls/calls.component';
import { CallsSharedService } from '../../shared/service-interaction/calls-shared.service';
import { HeadMaterialModule } from 'src/app/head/head.material.module';
@NgModule({
  imports: [CommonModule, ServiceInteractionRoutingModule, HeadMaterialModule, CommonUtilsModule],
  providers: [SelfSharedService, SelfServiceService, CallsSharedService],
  declarations: [SelfServiceComponent, CallsComponent]
})
export class ServiceInteractionModule {
  constructor() {
    console.log('ServiceInteraction Loaded');
  }
}
