import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniTileComponent } from './mini-tile/mini-tile.component';

@NgModule({
  imports: [CommonModule],
  exports: [MiniTileComponent],
  declarations: [MiniTileComponent]
})
export class CommonUtilsModule {}
