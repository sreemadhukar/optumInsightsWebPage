import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginStubComponent } from './login-stub/login-stub.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeadMaterialModule } from '../head/head.material.module';
import { CommonUtilsModule } from '../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, AuthRoutingModule, FormsModule, ReactiveFormsModule, HeadMaterialModule, CommonUtilsModule],
  declarations: [LoginStubComponent]
})
export class AuthModule {}
