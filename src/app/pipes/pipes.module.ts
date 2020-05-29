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
import { ImpactSearchPipe } from './impact-search.pipe';

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
    SearchHighlightPipe,
    ImpactSearchPipe
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
    SearchHighlightPipe,
    ImpactSearchPipe
  ]
})
export class PipesModule {}
