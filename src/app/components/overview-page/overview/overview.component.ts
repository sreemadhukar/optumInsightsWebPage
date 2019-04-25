import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
import { StorageService } from '../../../shared/storage-service.service';

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
  opportunities: String = '';
  opportunitiesQuestion: String = '';
  welcomeMessage: String = '';
  subscription: any;

  constructor(private overviewsrc: OverviewSharedService, private checkStorage: StorageService) {
    this.pagesubTitle = 'Your Insights at a glance.';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';
    this.welcomeMessage = '';
  }
  ngOnInit() {
    this.overviewsrc
      .getOverviewData()
      .then(data => {
        this.overviewItems = JSON.parse(JSON.stringify(data));
        // console.log(this.overviewItems);
        this.mainCards = this.overviewItems[0];
        this.selfServiceMiniCards = this.overviewItems[1];
        // console.log(this.selfServiceMiniCards);
      })
      .catch(reason => console.log(reason.message));
    this.userName = 'Anne';
    this.pageTitle = 'Hello, ' + this.userName + '.';

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }
}
