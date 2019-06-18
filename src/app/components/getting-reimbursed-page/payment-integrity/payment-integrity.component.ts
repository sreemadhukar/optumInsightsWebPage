import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';
import { GettingReimbursedSharedService } from 'src/app/shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  pageTitle: String = '';
  currentTabTitle: String = '';
  timePeriod = 'Last 6 months';
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
    private gettingReimbursedSharedService: GettingReimbursedSharedService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'down-green-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/down-positive-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'up-red-trend-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/up-negative-no-circle.svg')
    );
    this.pageTitle = 'Claims Payment Integrity';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
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
}
