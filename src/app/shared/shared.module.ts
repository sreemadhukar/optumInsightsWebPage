import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinuteSecondsPipe } from './minute-seconds.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [MinuteSecondsPipe],
  exports: [MinuteSecondsPipe]
})
export class SharedModule {}
