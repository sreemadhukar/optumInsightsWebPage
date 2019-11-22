import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintPageComponent } from './print-page/print-page.component';
const routes: Routes = [{ path: '', component: PrintPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule {}
