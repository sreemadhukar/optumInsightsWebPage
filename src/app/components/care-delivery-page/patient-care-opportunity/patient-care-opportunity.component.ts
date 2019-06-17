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
  summaryItems: any;
  pageTitle: String = '';
  loading: boolean;
  MRAStarData: any;
  MRACVCompletionData: any;
  StarRatings: any;
  mockCards: any;
  tabOptions: Array<Object> = [];
  previousSelected: Number = 0;
  selectedItemId: any = 0;
  tabOptionsTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  hideAllObjects: boolean;
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
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{}];
    this.summaryItems = [{}];
    this.MRACVCompletionData = [{}];

    this.priorAuthShared.getPCORMandRData().then(
      data => {
        this.loading = false;
        this.summaryItems = JSON.parse(JSON.stringify(data));
        this.MRAStarData = this.summaryItems[0];
        this.MRACVCompletionData = this.summaryItems[1];
        this.currentTabTitle = this.summaryItems[1].title;
        this.StarRatings = this.summaryItems[2];
      },
      error => {
        this.hideAllObjects = false;
      }
    );
  }
}
