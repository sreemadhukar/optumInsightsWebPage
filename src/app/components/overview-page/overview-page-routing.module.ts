import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { POverviewComponent } from './p-overview/p-overview.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { outlet: 'print', component: OverviewComponent, children: [{ path: 'invoice', component: POverviewComponent }] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewPageRoutingModule {}
