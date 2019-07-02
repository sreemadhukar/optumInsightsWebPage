import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GettingReimbursedSharedService } from 'src/app/shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  pageTitle: String = '';
  currentTabTitle: String = '';
  timePeriod: string;
  lob: string;
  taxID: Array<string>;
  title = 'Payment Integrity: Medical Record Coding Review';
  subscription: any;
  cardData: any;
  piDataloaded = false;
  loading: boolean;
  constructor(
    private glossaryExpandService: GlossaryExpandService,
    private checkStorage: StorageService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private filterExpandService: FilterExpandService,
    private session: SessionService,
    private router: Router,
    private filtermatch: CommonUtilsService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.ngOnInit());
    iconRegistry.addSvgIcon(
      'down-green-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/down-positive-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'up-red-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/up-negative-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    this.pageTitle = 'Claims Payment Integrity';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.timePeriod = this.session.filterObjValue.timeFrame;
    this.lob = this.filtermatch.matchLobWithLobData(this.session.filterObjValue.lob);
    this.taxID = this.session.filterObjValue.tax;
    if (this.taxID.length > 3) {
      this.taxID = [this.taxID.length + ' Selected'];
    }
    this.piDataloaded = false;
    this.loading = true;
    this.gettingReimbursedSharedService.getPaymentIntegrityData().then(r => {
      if (r != null) {
        this.cardData = r;
        this.loading = false;
        this.piDataloaded = true;
      } else {
        this.loading = false;
      }
    });
  }
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
