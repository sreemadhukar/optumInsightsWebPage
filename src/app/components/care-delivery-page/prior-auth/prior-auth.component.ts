import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/care-delivery/prior-auth-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';

@Component({
  selector: 'app-prior-auth',
  templateUrl: './prior-auth.component.html',
  styleUrls: ['./prior-auth.component.scss']
})
export class PriorAuthComponent implements OnInit {
  @Input() printStyle;
  summaryItems: any;
  reasonItems: any;
  mockCards: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  subscription: any;
  loading: boolean;
  hideAllObjects: boolean;
  title = 'Top Reasons for Prior Authorizations Not Approved';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  serviceSetting: string;
  priorAuthType: string;
  scType: string;
  filterParameters: any;
  constructor(
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService,
    private iconRegistry: MatIconRegistry,
    private session: SessionService,
    private readonly sanitizer: DomSanitizer,
    private common: CommonUtilsService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.pagesubTitle = 'Prior Authorizations';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('priorAuthPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
      this.common.urlResuseStrategy();
    });
    this.iconRegistry.addSvgIcon(
      'filter',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    if (this.printStyle) {
      this.pageTitle = this.session.getHealthCareOrgName();
    } else {
      this.pageTitle = 'Prior Authorizations';
    }

    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'priorAuthPage' });

    this.loading = true;
    this.hideAllObjects = true;
    this.reasonItems = [{}];
    this.summaryItems = [{}];
    this.mockCards = [{}, {}];

    this.priorAuthShared.getPriorAuthDataCombined(this.createPayloadService.payload).then(
      data => {
        this.loading = false;
        this.summaryItems = data[0];
        this.reasonItems = data[1];
      },
      () => {
        this.hideAllObjects = false;
      }
    );
  }
}
