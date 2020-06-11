import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcoPageComponent } from '../ACO/aco-page/aco-page.component';
import { HeadMaterialModule } from '../../head/head.material.module';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { AcoPageRoutingModule } from './aco-page-routing.module';

@NgModule({
  imports: [CommonModule, AcoPageRoutingModule, HeadMaterialModule, CommonUtilsModule],
  providers: [AcoPageComponent],
  declarations: [AcoPageComponent]
})
export class AcoModule {
  constructor() {
    console.log('ACO Loaded');
  }
}
