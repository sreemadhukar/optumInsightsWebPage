import { Component, OnInit } from '@angular/core';
import { SelfSharedService } from '../../../shared/service-interaction/self-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {
  pageTitle: String = '';
  previousSelected: any = 0;
  selfServiceItems: Array<Object> = [{}];
  timeFrame: String = '';

  opportunities: String = '';
  opportunitiesQuestion: String = '';

  mockCards: any;
  mockSelfServiceMiniCards = [{}, {}, {}, {}];
  selfServiceMiniCards = [];

  loading: boolean;

  subscription: any;

  constructor(
    private selfServiceSrc: SelfSharedService,
    private checkStorage: StorageService,
    private session: SessionService,
    private glossaryExpandService: GlossaryExpandService,
    private filtermatch: CommonUtilsService
  ) {
    this.pageTitle = 'Self Service';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.mockCards = [{}, {}, {}];
    this.mockSelfServiceMiniCards = [{}, {}, {}, {}];
    this.selfServiceMiniCards = [];
    this.loading = true;
    this.selfServiceSrc
      .getSelfServiceData()
      .then(selfServiceData => {
        this.loading = false;
        this.selfServiceItems = selfServiceData[0];
        this.selfServiceMiniCards = selfServiceData[1];
      })
      .catch(reason => console.log('Self Service Page Service Error ', reason));
  } // ngOnit funtion ends here
  helpIconClick(title) {
    // this.glossaryExpandService.setMessage(title, this.MetricID);
  }
}
