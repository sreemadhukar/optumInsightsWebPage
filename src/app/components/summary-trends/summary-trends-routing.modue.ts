import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderTrendsComponent } from './provider-trends/provider-trends.component';

const routes: Routes = [{ path: '', component: ProviderTrendsComponent, data: { breadcrumb: 'Summary Trends' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryTrendsRoutingModule {}
