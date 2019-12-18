import { Component, OnInit, Input } from '@angular/core';
import { SelfSharedService } from '../../../shared/service-interaction/self-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: ['./self-service.component.scss']
})
export class SelfServiceComponent implements OnInit {
  @Input() printStyle;
  pageTitle: String = '';
  pageSubTitle: String = '';
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
    private filtermatch: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService
  ) {
    this.pageTitle = 'Self Service';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('otherPages');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
      this.filtermatch.urlResuseStrategy();
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'selfServicePage' });
    this.mockCards = [{}, {}, {}];
    this.mockSelfServiceMiniCards = [{}, {}, {}, {}];
    this.selfServiceMiniCards = [];
    this.loading = true;
    if (this.printStyle) {
      this.pageSubTitle = 'Service Interaction - Self Service';
      this.pageTitle = this.session.getHealthCareOrgName();
    }
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
