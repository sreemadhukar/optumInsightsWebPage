import { Component, OnInit, Input } from '@angular/core';
import { CallsSharedService } from '../../../shared/service-interaction/calls-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';
import { REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  @Input() printStyle;
  callsItems: any;
  pageTitle: String = '';
  pageSubTitle: String = '';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  loading: boolean;
  mockCards: any;
  subscription: any;
  callsDataAvailable = false;
  printRoute: String;
  constructor(
    private checkStorage: StorageService,
    private callsServiceSrc: CallsSharedService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private common: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private createPayloadService: CreatePayloadService
  ) {
    this.printRoute = 'Calls';
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.pageSubTitle = 'Calls';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('callsPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
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
    this.printRoute = '/ServiceInteraction/Calls/print-calls';
  }

  ngOnInit() {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
      this.pageTitle = this.session.getHealthCareOrgName();
    }
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'callsPage' });
    this.loading = true;
    this.mockCards = [{}, {}];
    this.callsItems = [];
    this.callsDataAvailable = false;
    this.callsServiceSrc
      .getCallsData(this.createPayloadService.payload)
      .then(data => {
        this.loading = false;
        this.callsItems = data;
        if (this.callsItems.length !== 0) {
          this.callsDataAvailable = true;
        }
      })
      .catch(reason => {
        console.log('Calls Service Error ', reason);
        this.loading = false;
        this.callsDataAvailable = true;
      });
  }

  printDownload(value) {
    console.log('Calls Component', value);
  }
}
