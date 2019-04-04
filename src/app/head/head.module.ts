import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { HamburgerMenuComponent } from './hamburger-menu/hamburger-menu.component';
import { HeadRoutingModule } from './head-routing.module';
import { HeadMaterialModule } from './head.material.module';
import { ThemeService } from '../shared/theme.service';
import { MatToolbarModule, MatSlideToggleModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, HeadRoutingModule, HeadMaterialModule, MatSlideToggleModule],
  exports: [BodyComponent],
  declarations: [HeaderComponent, FooterComponent, HamburgerMenuComponent, BodyComponent]
})
export class HeadModule {}
