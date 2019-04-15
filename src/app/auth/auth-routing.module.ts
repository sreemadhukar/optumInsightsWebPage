import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginStubComponent } from './login-stub/login-stub.component';

const routes: Routes = [{ path: '', component: LoginStubComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
