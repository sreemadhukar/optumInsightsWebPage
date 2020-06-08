import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmReportComponent } from './adm-report/adm-report.component';

const routes: Routes = [
  {
    path: 'ADMReport',
    component: AdmReportComponent,
    data: {
      breadcrumb: 'Appropriate Decision Monitoring (ADM)'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkManagementRoutingModule {}
