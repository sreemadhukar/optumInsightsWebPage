import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RlpCommonBarComponent],
  exports: [RlpCommonBarComponent]
})
export class RlpCommonUtilsModule {}
