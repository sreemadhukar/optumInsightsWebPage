import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtilsModule } from './../../common-utils/common-utils.module';
import { NetworkManagementRoutingModule } from './network-management-routing.module';
import { AdmReportComponent } from './adm-report/adm-report.component';

@NgModule({
  imports: [CommonModule, NetworkManagementRoutingModule, CommonUtilsModule],
  providers: [],
  declarations: [AdmReportComponent]
})
export class NetworkManagementModule {}
