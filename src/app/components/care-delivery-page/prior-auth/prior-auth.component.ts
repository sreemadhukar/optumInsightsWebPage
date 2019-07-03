import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { SessionService } from 'src/app/shared/session.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';

@Component({
  selector: 'app-prior-auth',
  templateUrl: './prior-auth.component.html',
  styleUrls: ['./prior-auth.component.scss']
})
export class PriorAuthComponent implements OnInit {
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
  filterParameters: any;
  constructor(
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private session: SessionService,
    sanitizer: DomSanitizer,
    private filtermatch: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    this.pagesubTitle = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  ngOnInit() {
    this.filterParameters = this.session.filterObjValue;
    this.timePeriod = this.session.filterObjValue.timeFrame;
    this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    this.taxID = this.session.filterObjValue.tax;
    if (this.taxID.length > 3) {
      this.taxID = [this.taxID.length + ' Selected'];
    }
    if (this.session.filterObjValue.serviceSetting) {
      this.serviceSetting = this.session.filterObjValue.serviceSetting;
    } else {
      this.serviceSetting = 'All';
      this.filterParameters.serviceSetting = 'All';
    }
    this.pageTitle = 'Prior Authorizations';
    this.loading = true;
    this.hideAllObjects = true;
    this.reasonItems = [{}];
    this.summaryItems = [{}];
    this.mockCards = [{}, {}];
    console.log(this.filterParameters);

    this.priorAuthShared.getPriorAuthDataFiltered(this.filterParameters).then(
      data => {
        this.loading = false;
        this.summaryItems = data[0];
        this.reasonItems = data[1];
      },
      error => {
        this.hideAllObjects = false;
      }
    );

    /*
    this.priorAuthShared.getPriorAuthData().then(
      data => {
        this.loading = false;
        this.summaryItems = data[0];
        this.reasonItems = data[1];
      },
      error => {
        this.hideAllObjects = false;
      }
    );
    */
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
