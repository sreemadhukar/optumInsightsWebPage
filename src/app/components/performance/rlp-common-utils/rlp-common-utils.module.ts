import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpHeaderComponent } from './rlp-header/rlp-header.component';
import { RlpTableComponent } from './rlp-table/rlp-table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RlpCommonBarComponent, RlpTableComponent, RlpHeaderComponent],
  exports: [RlpCommonBarComponent, RlpTableComponent, RlpHeaderComponent]
})
export class RlpCommonUtilsModule {}
