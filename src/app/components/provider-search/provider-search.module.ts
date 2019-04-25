import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderSearchRoutingModule } from './provider-search-routing.module';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [CommonModule, ProviderSearchRoutingModule],
  declarations: [SearchComponent]
})
export class ProviderSearchModule {}
