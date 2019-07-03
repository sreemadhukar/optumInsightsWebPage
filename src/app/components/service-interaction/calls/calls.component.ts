import { Component, OnInit } from '@angular/core';
import { CallsSharedService } from '../../../shared/service-interaction/calls-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callsItems: Array<Object> = [{}];
  pageTitle: String = '';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  loading: boolean;
  mockCards: any;
  subscription: any;
  constructor(
    private checkStorage: StorageService,
    private callsServiceSrc: CallsSharedService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private filtermatch: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    this.pageTitle = 'Calls';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
  }

  ngOnInit() {
    this.timePeriod = this.session.filterObjValue.timeFrame;
    this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    this.taxID = this.session.filterObjValue.tax;
    if (this.taxID.length > 3) {
      this.taxID = [this.taxID.length + ' Selected'];
    }
    this.loading = true;
    this.mockCards = [{}, {}];
    this.callsServiceSrc
      .getCallsData()
      .then(data => {
        this.loading = false;
        this.callsItems = data[0];
      })
      .catch(reason => {
        console.log('Calls Service Error ', reason);
        this.loading = false;
      });
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
