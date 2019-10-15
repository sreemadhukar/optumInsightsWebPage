import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginStubComponent } from './login-stub/login-stub.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeadMaterialModule } from '../head/head.material.module';
import { CommonUtilsModule } from '../common-utils/common-utils.module';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { IdleTimeoutDialogComponent } from './idle-timeout-dialog/idle-timeout-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HeadMaterialModule,
    CommonUtilsModule,
    SharedModule
  ],
  declarations: [LoginStubComponent, SessionTimeoutComponent, IdleTimeoutDialogComponent]
})
export class AuthModule {
  constructor() {
    console.log('Login loaded');
  }
}
