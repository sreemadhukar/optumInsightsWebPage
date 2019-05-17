import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { HeadRoutingModule } from './head-routing.module';
import { HeadMaterialModule } from './head.material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../auth/_helpers/jwt.interceptor';
import { ErrorInterceptor } from '../auth/_helpers/error.interceptor';
import { CommonUtilsModule } from './../common-utils/common-utils.module';

@NgModule({
  imports: [CommonModule, HeadRoutingModule, HeadMaterialModule, CommonUtilsModule],
  exports: [BodyComponent],
  declarations: [HeaderComponent, FooterComponent, HamburgerMenuComponent, BodyComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class HeadModule {}
