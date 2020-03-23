import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RlpCommonBarComponent } from './d3/rlp-common-bar/rlp-common-bar.component';
import { RlpHeaderComponent } from './rlp-header/rlp-header.component';
import { RlpTableComponent } from './rlp-table/rlp-table.component';
import { RlpTableItemComponent } from './rlp-table/rlp-table-item/rlp-table-item.component';
import { PipesModule } from './../../../pipes/pipes.module';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { CommonBarComponent } from './d3/common-bar/common-bar.component';

@NgModule({
  imports: [CommonModule, FormsModule, PipesModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  declarations: [
    RlpCommonBarComponent,
    RlpTableComponent,
    RlpTableItemComponent,
    RlpHeaderComponent,
    CommonBarComponent
  ],
  exports: [RlpCommonBarComponent, RlpTableComponent, RlpTableItemComponent, RlpHeaderComponent, CommonBarComponent]
})
export class RlpCommonUtilsModule {}
