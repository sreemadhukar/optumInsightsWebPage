import { Component, OnInit } from '@angular/core';
import { OverviewComponent } from './../overview/overview.component';
@Component({
  selector: 'app-p-overview',
  templateUrl: './p-overview.component.html',
  styleUrls: ['./p-overview.component.scss']
})
export class POverviewComponent implements OnInit {
  constructor(private overviewComponent: OverviewComponent) {}

  ngOnInit() {}
}
