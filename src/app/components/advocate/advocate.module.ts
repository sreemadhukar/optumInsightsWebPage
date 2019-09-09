import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewAdvocateComponent } from './overview-advocate/overview-advocate.component';
import { TopRowAdvOverviewComponent } from './top-row-adv-overview/top-row-adv-overview.component';
import { AdvocateRoutingModule } from './advocate-routing.module';

@NgModule({
  imports: [CommonModule, AdvocateRoutingModule],
  declarations: [OverviewAdvocateComponent, TopRowAdvOverviewComponent]
})
export class AdvocateModule {}
