import { Component, OnInit } from '@angular/core';
import { OverviewComponent } from './../overview/overview.component';
@Component({
  selector: 'app-p-overview',
  templateUrl: './p-overview.component.html',
  styleUrls: ['./p-overview.component.scss']
})
export class POverviewComponent implements OnInit {
  public pagesubTitle;
  public pageTitle;
  constructor(private overviewComponent: OverviewComponent) {}

  ngOnInit() {
    this.pageTitle = this.overviewComponent.pageTitle;
    this.pagesubTitle = this.overviewComponent.pagesubTitle;
  }
}
