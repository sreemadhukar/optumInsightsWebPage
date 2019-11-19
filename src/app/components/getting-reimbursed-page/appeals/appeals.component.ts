import { Component, OnInit } from '@angular/core';
import { AppealsSharedService } from '../../../shared/getting-reimbursed/appeals/appeals-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';

@Component({
  selector: 'app-appeals',
  templateUrl: './appeals.component.html',
  styleUrls: ['./appeals.component.scss']
})
export class AppealsComponent implements OnInit {
  summaryItems: any;
  pageTitle: String = '';
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  subscription: any;
  overturn: any;
  overturnItem: Array<Object> = [{}];
  overturnReasonItem: any;
  reason: any = [];
  title = 'Top Claims Appeals Overturn Reasons';
  MetricID = '102';
  loading: boolean;
  mockCards: any;
  reasonDataAvailable = true;
  appealsTAT: object;
  showAppealsTAT = false;
  constructor(
    private appealsSharedService: AppealsSharedService,
    private iconRegistry: MatIconRegistry,
    private checkStorage: StorageService,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    private common: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService
  ) {
    // const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.pageTitle = 'Claims Appeals';
    // this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.common.urlResuseStrategy();
    });
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'appealsPage' });
    this.timePeriod = this.common.getTimePeriodFilterValue(this.createPayloadService.payload.timePeriod);
    this.loading = true;
    this.mockCards = [{}, {}, {}, {}];
    this.currentSummary = [];
    this.overturnItem = [];
    this.reasonDataAvailable = false;

    this.appealsSharedService.getappealsRateAndReasonData(this.createPayloadService.payload).then(appealsRateData => {
      let AppealsCards: any;
      AppealsCards = appealsRateData;
      this.loading = false;
      this.overturnItem = AppealsCards;
    });
    this.appealsSharedService.getAppealsReasonData(this.createPayloadService.payload).then(appealsReason => {
      let appealsReasonData: any;
      appealsReasonData = appealsReason;
      if (appealsReasonData[0].status !== null && appealsReasonData[0].data !== null) {
        this.reasonDataAvailable = true;
      } else {
        this.reasonDataAvailable = false;
      }
      this.reason = appealsReasonData;
    });

    // this.appealsSharedService.getappealsTatandDevidedOverturnData().then(appealsRateData => {
    //   this.appealsTAT = appealsRateData;
    //   this.showAppealsTAT = true;
    // });

    /*this.appealsTAT = {
      category: 'app-card',
      type: 'rotateWithLabel',
      title: 'Average Appeals Turn Around Time',
      MetricID: 'NA',
      data: {
        centerNumber: 0 + ' days',
        color: ['#3381FF', '#3381FF'],
        gdata: ['card-inner', 'appealsAverageTurnAround'],
        sdata: {
          sign: 'down',
          data: '-1.2%'
        }
      },
      besideData: {
        verticalData: [
          {
            values: 0 + ' Days',
            labels: 'Date of Service to Received'
          },
          {
            values: 0 + ' Days',
            labels: 'Received to Processed'
          }
        ]
      },
      timeperiod: this.session.filterObjValue.timeFrame
    };*/
  }

  helpIconClick(title) {
    if (title === 'Top Claims Appeals Overturn Reasons') {
      this.glossaryExpandService.setMessage(title, this.MetricID);
    }
  }
}
