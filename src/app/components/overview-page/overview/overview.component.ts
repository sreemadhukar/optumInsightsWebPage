import { Component, OnInit } from '@angular/core';
import { OverviewService } from '../../../rest/overview/overview.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  constructor(private overviewsrc: OverviewService) {}

  ngOnInit() {
    this.overviewsrc.getOverviewData().subscribe(mockUp => {});
  }
}
