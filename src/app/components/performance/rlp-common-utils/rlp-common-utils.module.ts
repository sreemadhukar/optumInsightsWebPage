import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpHeaderComponent } from './rlp-header/rlp-header.component';
import { RlpTableComponent } from './rlp-table/rlp-table.component';
import { RlpTableItemComponent } from './rlp-table/rlp-table-item/rlp-table-item.component';
import { PipesModule } from './../../../pipes/pipes.module';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, FormsModule, PipesModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  declarations: [RlpCommonBarComponent, RlpTableComponent, RlpTableItemComponent, RlpHeaderComponent],
  exports: [RlpCommonBarComponent, RlpTableComponent, RlpTableItemComponent, RlpHeaderComponent]
})
export class RlpCommonUtilsModule {}
