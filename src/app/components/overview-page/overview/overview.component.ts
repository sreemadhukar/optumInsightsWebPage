import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  private pageTitle: String = '';
  private pagesubTitle: String = '';
  constructor() {
    this.pageTitle = 'Hello, Anne.';
    this.pagesubTitle = 'Your Insights at a glance.';
  }
  ngOnInit() {}
}
