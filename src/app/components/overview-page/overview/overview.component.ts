import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  constructor(private overviewsrc: OverviewSharedService) {}

  ngOnInit() {
    this.overviewsrc.getOverviewData();
  }
}
