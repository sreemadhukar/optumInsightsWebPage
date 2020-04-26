import { Component, OnInit, Input } from '@angular/core';
import { IAdvTinDetailsResponse } from '../../user.class';
import { SessionService } from '../../../../../shared/session.service';
import { StorageService } from '../../../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-impact-card',
  templateUrl: './impact-card.component.html',
  styleUrls: ['./impact-card.component.scss']
})
export class ImpactCardComponent implements OnInit {
  @Input() data: IAdvTinDetailsResponse;
  linkName = 'Overview';
  constructor(
    private session: SessionService,
    private storage: StorageService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg'
      )
    );
  }

  ngOnInit() {}

  providerSelection() {
    if (this.data !== null) {
      const providerData = JSON.parse(sessionStorage.getItem('currentUser'));
      const provider = providerData[0];
      if (providerData[0].hasOwnProperty('Providersyskey')) {
        provider.healthcareorganizationname = this.data.ProviderSystem;
        provider.ProviderKey = this.data.ProviderSysKey;
        this.storage.store('currentUser', [provider]);
      } else {
        const providerObj = {
          HealthCareOrganizationName: this.data.ProviderSystem,
          ProviderKey: this.data.ProviderSysKey
        };
        this.storage.store('currentUser', [Object.assign(provider, providerObj)]);
      }
    }
  }

  navigateToHealthSystemDetails() {
    this.providerSelection();
    window.location.href = '/OverviewPageAdvocate/HealthSystemDetails/';
  }

  navigateToOverview() {
    this.providerSelection();
    window.location.href = '/OverviewPageAdvocate';
  }
}
