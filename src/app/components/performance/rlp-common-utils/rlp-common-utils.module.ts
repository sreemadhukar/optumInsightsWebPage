import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpTableComponent } from './rlp-table/rlp-table.component';
import { RlpTableItemComponent } from './rlp-table/rlp-table-item/rlp-table-item.component';
import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, FormsModule, PipesModule],
  declarations: [RlpCommonBarComponent, RlpTableComponent, RlpTableItemComponent],
  exports: [RlpCommonBarComponent, RlpTableComponent, RlpTableItemComponent]
})
export class RlpCommonUtilsModule {}
