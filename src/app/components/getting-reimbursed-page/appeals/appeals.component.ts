import { Component, OnInit } from '@angular/core';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';

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
  reason: any;
  title = 'Top Claims Appeals Overturn Reasons';
  loading: boolean;
  mockCards: any;
  reasonDataAvailable = false;
  constructor(
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private iconRegistry: MatIconRegistry,
    private checkStorage: StorageService,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    private filtermatch: CommonUtilsService
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    this.pageTitle = 'Claims Appeals';
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
    this.mockCards = [{}, {}, {}, {}];
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.loading = false;
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[3].data;
      console.log(this.currentSummary);
      this.currentTabTitle = this.summaryItems[3].title;
    });

    this.gettingReimbursedSharedService.getappealsRateAndReasonData().then(appealsRateData => {
      this.loading = false;
      if (appealsRateData[1].length !== 0) {
        this.reasonDataAvailable = true;
      }
      this.overturnItem = appealsRateData[0];
      this.reason = appealsRateData[1];
    });
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
