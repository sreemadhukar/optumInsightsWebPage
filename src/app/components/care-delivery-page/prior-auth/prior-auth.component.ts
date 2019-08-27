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
  priorAuthType: string;
  scType: string;
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
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      // changing the session will trigger ngoninit
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: ['All'],
        serviceSetting: this.session.filterObjValue.serviceSetting,
        scType: this.session.filterObjValue.scType
      });
      // this.ngOnInit();
    });
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    this.filterParameters = this.session.filterObjValue;
    this.timePeriod = this.session.filterObjValue.timeFrame;
    if (this.session.filterObjValue.lob !== 'All') {
      this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    } else {
      this.lob = '';
    }
    if (this.session.filterObjValue.tax.length > 0 && this.session.filterObjValue.tax[0] !== 'All') {
      this.taxID = this.session.filterObjValue.tax;
      if (this.taxID.length > 3) {
        this.taxID = [this.taxID.length + ' Selected'];
      }
    } else {
      this.taxID = [];
    }
    if (this.session.filterObjValue.serviceSetting) {
      this.serviceSetting = this.session.filterObjValue.serviceSetting;
    } else {
      this.serviceSetting = 'All';
      this.filterParameters.serviceSetting = 'All';
    }
    if (this.session.filterObjValue.priorAuthType) {
      this.priorAuthType = this.session.filterObjValue.priorAuthType;
    } else {
      this.priorAuthType = 'All';
      this.filterParameters.priorAuthType = 'All';
    }
    if (this.session.filterObjValue.scType) {
      this.filterParameters.scType = this.session.filterObjValue.scType;
      this.scType = this.filterParameters.scType;
    } else {
      this.filterParameters.scType = 'All';
      this.scType = this.filterParameters.scType;
    }
    this.pageTitle = 'Prior Authorizations';
    this.loading = true;
    this.hideAllObjects = true;
    this.reasonItems = [{}];
    this.summaryItems = [{}];
    this.mockCards = [{}, {}];
    // console.log(this.filterParameters);

    /*
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


    this.priorAuthShared.getPriorAuthTrendData(this.filterParameters).then(data => {
      console.log(data);
    });
    */

    this.priorAuthShared.getPriorAuthDataCombined(this.filterParameters).then(
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
    this.priorAuthShared.getNewPAData(this.filterParameters).then(data => {
      console.log(data);
    });


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
  removeFilter(type, value) {
    if (type === 'lob') {
      this.lob = '';
      this.session.store({
        timeFrame: this.timePeriod,
        lob: 'All',
        tax: this.session.filterObjValue.tax,
        serviceSetting: this.session.filterObjValue.serviceSetting,
        priorAuthType: this.session.filterObjValue.priorAuthType,
        scType: this.session.filterObjValue.scType
      });
    } else if (type === 'tax' && !value.includes('Selected')) {
      this.taxID = this.session.filterObjValue.tax.filter(id => id !== value);
      if (this.taxID.length > 0) {
        this.session.store({
          timeFrame: this.timePeriod,
          lob: this.session.filterObjValue.lob,
          tax: this.taxID,
          serviceSetting: this.session.filterObjValue.serviceSetting,
          priorAuthType: this.session.filterObjValue.priorAuthType,
          scType: this.session.filterObjValue.scType
        });
      } else {
        this.session.store({
          timeFrame: this.timePeriod,
          lob: this.session.filterObjValue.lob,
          tax: ['All'],
          serviceSetting: this.session.filterObjValue.serviceSetting,
          priorAuthType: this.session.filterObjValue.priorAuthType,
          scType: this.session.filterObjValue.scType
        });
        this.taxID = [];
      }
    } else if (type === 'tax' && value.includes('Selected')) {
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: ['All'],
        serviceSetting: this.session.filterObjValue.serviceSetting,
        priorAuthType: this.session.filterObjValue.priorAuthType,
        scType: this.session.filterObjValue.scType
      });
      this.taxID = [];
    } else if (type === 'serviceSetting') {
      this.serviceSetting = 'All';
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: this.session.filterObjValue.tax,
        serviceSetting: 'All',
        priorAuthType: this.session.filterObjValue.priorAuthType,
        scType: this.session.filterObjValue.scType
      });
    } else if (type === 'priorAuthType') {
      this.priorAuthType = 'All';
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: this.session.filterObjValue.tax,
        serviceSetting: this.session.filterObjValue.serviceSetting,
        priorAuthType: 'All',
        scType: this.session.filterObjValue.scType
      });
    } else if (type === 'paserviceCategoty') {
      // add var
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: this.session.filterObjValue.tax,
        serviceSetting: this.session.filterObjValue.serviceSetting,
        priorAuthType: this.session.filterObjValue.priorAuthType,
        scType: 'All'
      });
    } else if (type === 'scType') {
      this.scType = 'All';
      this.session.store({
        timeFrame: this.timePeriod,
        lob: this.session.filterObjValue.lob,
        tax: this.session.filterObjValue.tax,
        serviceSetting: this.session.filterObjValue.serviceSetting,
        priorAuthType: this.session.filterObjValue.priorAuthType,
        scType: 'All'
      });
    }
  }
}
