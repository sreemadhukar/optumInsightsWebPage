import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewItems: Object;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  sampleDonut: any = {};
  sampleStar: any = {};
  constructor(private overviewsrc: OverviewSharedService) {
    this.pagesubTitle = 'Your Insights at a glance.';
  }
  ngOnInit() {
    this.overviewsrc
      .getOverviewData()
      .then(data => {
        this.overviewItems = JSON.parse(JSON.stringify(data));
      })
      .catch(reason => console.log(reason.message));
    this.userName = 'Anne';
    this.pageTitle = 'Hello, ' + this.userName + '.';
  }
}
