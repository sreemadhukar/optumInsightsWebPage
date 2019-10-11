import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
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
import { HttpInterceptorService } from './rest/interceptor/http-interceptor.service';
import { CacheInterceptor } from './rest/interceptor/cache.interceptor';
import { KOPSharedService } from './shared/kop/kop.service';
import { KopService } from './rest/kop/kop.service';
import { UserIdleModule } from 'angular-user-idle';
import { IdleTimeoutDialogComponent } from './auth/idle-timeout-dialog/idle-timeout-dialog.component';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { FilterReducer, INITIAL_STATE } from './store/filter/reducer';
import { IAppState } from './store/store';

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
    NgReduxModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes)
    // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({ idle: 1.8, timeout: 180, ping: 1 })
  ],
  providers: [
    ProviderService,
    ProviderSharedService,
    ThemeService,
    CookieService,
    KopService,
    KOPSharedService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  entryComponents: [IdleTimeoutDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(FilterReducer, INITIAL_STATE);
  }
}
