import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from './currency-formatter.pipe';
import { TemporaryTextFormatterPipe } from './temporary-text-formatter.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [CurrencyFormatterPipe, TemporaryTextFormatterPipe],
  exports: [CurrencyFormatterPipe, TemporaryTextFormatterPipe]
})
export class PipesModule {}
