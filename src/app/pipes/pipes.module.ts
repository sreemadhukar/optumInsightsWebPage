import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from './currency-formatter.pipe';
import { TemporaryTextFormatterPipe } from './temporary-text-formatter.pipe';
import { TimePeriodPipe } from './timeperiod.pipe';
import { QuarterPipe } from './quartercard.pipe';
import { CountryFormatterPipe } from './country-formatter.pipe';
import { SliceStringPipe } from './slice-string.pipe';
import { ZeroValueFormatterPipe } from './zero-value-formatter.pipe';
import { RlpSearchPipe } from './rlp-search.pipe';
import { SearchHighlightPipe } from './search-highlight.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CurrencyFormatterPipe,
    TimePeriodPipe,
    QuarterPipe,
    TemporaryTextFormatterPipe,
    CountryFormatterPipe,
    SliceStringPipe,
    ZeroValueFormatterPipe,
    RlpSearchPipe,
    SearchHighlightPipe
  ],
  exports: [
    CurrencyFormatterPipe,
    TimePeriodPipe,
    QuarterPipe,
    TemporaryTextFormatterPipe,
    CountryFormatterPipe,
    SliceStringPipe,
    ZeroValueFormatterPipe,
    RlpSearchPipe,
    SearchHighlightPipe
  ]
})
export class PipesModule {}
