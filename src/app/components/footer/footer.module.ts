import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterCommonComponent } from './footer-common/footer-common.component';

@NgModule({
  imports: [CommonModule],
  exports: [FooterCommonComponent],
  declarations: [FooterCommonComponent]
})
export class FooterModule {}
