import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintRoutingModule } from './print-routing.module';
import { PrintPageComponent } from './print-page/print-page.component';

@NgModule({
  imports: [CommonModule, PrintRoutingModule],
  declarations: [PrintPageComponent]
})
export class PrintModule {}
