import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KopNpsComponent } from './kop-nps/kop-nps.component';

const routes: Routes = [
  { path: '', component: KopOverviewComponent },
  {
    path: 'NpsDetail',
    component: KopNpsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowOurProviderRoutingModule {}
