import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderSearchRoutingModule } from './provider-search-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeadMaterialModule } from './../../head/head.material.module';
import { SearchComponent } from './search/search.component';
import { SelectProviderComponent } from './select-provider/select-provider.component';

@NgModule({
  imports: [CommonModule, ProviderSearchRoutingModule, FormsModule, ReactiveFormsModule, HeadMaterialModule],
  declarations: [SearchComponent, SelectProviderComponent]
})
export class ProviderSearchModule {}
