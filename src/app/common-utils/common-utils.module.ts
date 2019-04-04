import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniTileComponent } from './mini-tile/mini-tile.component';
import { CardComponent } from './card/card.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { CommonFooterComponent } from './common-footer/common-footer.component';

@NgModule({
  imports: [CommonModule],
  exports: [MiniTileComponent, CardComponent, CommonFooterComponent, CommonHeaderComponent],
  declarations: [MiniTileComponent, CardComponent, CommonHeaderComponent, CommonFooterComponent]
})
export class CommonUtilsModule {}
