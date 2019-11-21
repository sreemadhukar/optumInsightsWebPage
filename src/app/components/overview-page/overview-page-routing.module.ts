import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { PrintOverviewComponent } from './print-overview/print-overview.component';
const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'print-overview', component: PrintOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewPageRoutingModule {}
