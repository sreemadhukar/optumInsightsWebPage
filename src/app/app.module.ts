import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
import { HttpInterceptorService } from './rest/interceptor/http-interceptor.service';
import { CacheInterceptor } from './rest/interceptor/cache.interceptor';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

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
    AuthModule,
    PDFExportModule
  ],
  providers: [
    ProviderService,
    ProviderSharedService,
    ThemeService,
    CookieService,
    PriorAuthService,
    PriorAuthSharedService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
