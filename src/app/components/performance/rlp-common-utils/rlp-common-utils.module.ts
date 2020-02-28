import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpHeaderComponent } from './rlp-header/rlp-header.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RlpCommonBarComponent, RlpHeaderComponent],
  exports: [RlpCommonBarComponent, RlpHeaderComponent]
})
export class RlpCommonUtilsModule {}
