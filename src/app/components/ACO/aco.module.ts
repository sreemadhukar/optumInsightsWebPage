import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcoPageComponent } from '../ACO/aco-page/aco-page.component';
import { HeadMaterialModule } from '../../head/head.material.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { AcoPageRoutingModule } from './aco-page-routing.module';
import { AcoSharedService } from '../../shared/ACO/aco-shared.service';
import { AcoService } from '../../rest/aco/aco.service';

@NgModule({
  imports: [CommonModule, AcoPageRoutingModule, HeadMaterialModule, CommonUtilsModule],
  providers: [AcoPageComponent, AcoSharedService, AcoService],
  declarations: [AcoPageComponent]
})
export class AcoModule {
  constructor() {
    console.log('ACO Loaded');
  }
}
