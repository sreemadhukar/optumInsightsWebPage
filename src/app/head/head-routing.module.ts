import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [  {
  path: '',
  loadChildren: '../components/overview-page/overview-page.module#OverviewPageModule'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HeadRoutingModule { }
