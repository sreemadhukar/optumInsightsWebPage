import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SelectProviderComponent } from './select-provider/select-provider.component';

const routes: Routes = [
  { path: '', component: SelectProviderComponent },
  {
    path: 'SelectProvider',
    component: SelectProviderComponent
  },
  {
    path: 'Search',
    component: SearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderSearchRoutingModule {}
