import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';

@Component({
  selector: 'app-patient-care-opportunity',
  templateUrl: './patient-care-opportunity.component.html',
  styleUrls: ['./patient-care-opportunity.component.scss']
})
export class PatientCareOpportunityComponent implements OnInit {
  subscription: any;
  pageTitle: String = '';
  loading: boolean;
  constructor(
    private priorAuthService: PriorAuthService,
    private sessionService: SessionService,
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.loading = true;
    this.priorAuthShared.getPCORMandRData().then(
      data => {
        console.log(data);
      },
      error => {}
    );
  }
}
