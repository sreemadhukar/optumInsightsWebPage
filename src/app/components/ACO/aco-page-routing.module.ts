import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcoPageComponent } from '../ACO/aco-page/aco-page.component';

const routes: Routes = [{ path: '', component: AcoPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcoPageRoutingModule {}
