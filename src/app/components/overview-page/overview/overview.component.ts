import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overviewItems: any;
  mainCards: any;
  selfServiceMiniCards: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(private overviewsrc: OverviewSharedService) {
    this.pagesubTitle = 'Your Insights at a glance.';
  }
  ngOnInit() {
    this.overviewsrc
      .getOverviewData()
      .then(data => {
        this.overviewItems = JSON.parse(JSON.stringify(data));
        const yes = this.overviewItems[0];
        console.log(yes);
        this.mainCards = [yes[1], yes[4], yes[5]];
        this.selfServiceMiniCards = this.overviewItems[1];
      })
      .catch(reason => console.log(reason.message));
    this.userName = 'Anne';
    this.pageTitle = 'Hello, ' + this.userName + '.';
  }
}
