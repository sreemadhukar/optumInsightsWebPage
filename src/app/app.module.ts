import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeadModule } from './head/head.module';
import { SharedModule } from './shared/shared.module';
import { CommonUtilsModule } from './common-utils/common-utils.module';
import { RestModule } from './rest/rest.module';
import { PipesModule } from './pipes/pipes.module';
import { AuthModule } from './auth/auth.module';
import { ProviderService } from './rest/provider/provider.service';
import { ProviderSharedService } from './shared/provider/provider-shared.service';
import { ThemeService } from './shared/theme.service';
import { PriorAuthService } from './rest/prior-auth/prior-auth.service';
import { PriorAuthSharedService } from './shared/prior-authorization/prior-auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HeadModule,
    SharedModule,
    CommonUtilsModule,
    RestModule,
    PipesModule,
    AuthModule
  ],
  providers: [ProviderService, ProviderSharedService, ThemeService, PriorAuthService, PriorAuthSharedService],
  bootstrap: [AppComponent]
})
export class AppModule {}
