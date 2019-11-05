import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterModule } from './../components/footer/footer.module';
import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { HeadRoutingModule } from './head-routing.module';
import { HeadMaterialModule } from './head.material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../auth/_helpers/jwt.interceptor';
import { ErrorInterceptor } from '../auth/_helpers/error.interceptor';
import { CommonUtilsModule } from './../common-utils/common-utils.module';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SiteMapComponent } from './site-map/site-map.component';
import { CustomPreloadingStrategy } from './custom-preloading';
@NgModule({
  imports: [CommonModule, HeadRoutingModule, HeadMaterialModule, CommonUtilsModule, FooterModule],
  exports: [BodyComponent, HeaderComponent],
  declarations: [
    HeaderComponent,
    HamburgerMenuComponent,
    BodyComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    SiteMapComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CustomPreloadingStrategy
  ]
})
export class HeadModule {}
