import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from './currency-formatter.pipe';
import { TemporaryTextFormatterPipe } from './temporary-text-formatter.pipe';
import { TimePeriodPipe } from './timeperiod.pipe';
import { QuarterPipe } from './quartercard.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [CurrencyFormatterPipe, TimePeriodPipe, QuarterPipe, TemporaryTextFormatterPipe],
  exports: [CurrencyFormatterPipe, TimePeriodPipe, QuarterPipe, TemporaryTextFormatterPipe]
})
export class PipesModule {}
