import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpHeaderComponent } from './rlp-header/rlp-header.component';
import { RlpTableComponent } from './rlp-table/rlp-table.component';
import { CommonBarComponent } from './d3/common-bar/common-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RlpCommonBarComponent, RlpTableComponent, RlpHeaderComponent, CommonBarComponent],
  exports: [RlpCommonBarComponent, RlpTableComponent, RlpHeaderComponent]
})
export class RlpCommonUtilsModule {}
