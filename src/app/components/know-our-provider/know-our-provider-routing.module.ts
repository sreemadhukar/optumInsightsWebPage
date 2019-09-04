import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';

const routes: Routes = [{ path: '', component: KopOverviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowOurProviderRoutingModule {}
