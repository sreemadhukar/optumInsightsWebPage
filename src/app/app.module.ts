import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeadModule } from './head/head.module';
import { SharedModule } from './shared/shared.module';
import { CommonUtilsModule } from './common-utils/common-utils.module';
import { RestModule } from './rest/rest.module';
import { PipesModule } from './pipes/pipes.module';
// import { DonutChartComponent } from './components/d3-objects/donut-chart/donut-chart.component';
import { BarChartComponent } from './common-utils/d3-objects/bar-chart/bar-chart.component';
import { AuthModule } from './auth/auth.module';
import { MatExpansionModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [AppComponent, BarChartComponent],
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
    MatExpansionModule,
    AuthModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
