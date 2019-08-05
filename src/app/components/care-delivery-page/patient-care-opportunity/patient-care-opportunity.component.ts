import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { PatientCareOpportunityService } from '../../../rest/PCOR/patient-care-opportunity.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';
import { PCORSharedService } from '../../../shared/PCOR/pcor-shared.service';
@Component({
  selector: 'app-patient-care-opportunity',
  templateUrl: './patient-care-opportunity.component.html',
  styleUrls: ['./patient-care-opportunity.component.scss']
})
export class PatientCareOpportunityComponent implements OnInit {
  subscription: any;
  summaryItems: any;
  qualityMeasureData: any;
  pageTitle: String = '';
  loading: boolean;
  MRAStarData: any;
  MRACVCompletionData: any;
  StarRatings: any;
  mockCards: any;
  PCORTabData: boolean;
  tabOptions: Array<Object> = [];
  previousSelected: Number = 0;
  selectedItemId: any = 0;
  tabOptionsTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  hideAllObjects: boolean;
  ratingClicked: number;
  starMeasure: any;
  qualityTitle: String = 'Quality Star Rating';
  constructor(
    private priorAuthService: PriorAuthService,
    private sessionService: SessionService,
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService,
    private pcorSharedService: PCORSharedService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }
  public ratingComponentClick(clickObj: any): void {
    this.priorAuthShared.getPCORMandRData().then(data => {
      this.summaryItems = JSON.parse(JSON.stringify(data));
      this.StarRatings = this.summaryItems[2];
      const item = this.StarRatings[0];

      const x = item.data.starCount;
      for (let i = 0; i <= 5; i++) {
        if (i === x) {
          console.log('xxx' + i);
        } else {
        }
      }

      console.log('summary' + this.summaryItems[2]);
      console.log(x);
    });
  }
  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.loading = true;
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{}];
    this.summaryItems = [{}];
    this.qualityMeasureData = [{}];
    this.MRACVCompletionData = [{}];
    this.StarRatings = [{}];
    this.PCORTabData = true;

    this.priorAuthShared.getPCORMandRData().then(
      data => {
        this.loading = false;
        this.summaryItems = JSON.parse(JSON.stringify(data));
        this.MRAStarData = this.summaryItems[0];
        this.MRACVCompletionData = this.summaryItems[1];
        this.currentTabTitle = this.summaryItems[1].title;
        this.StarRatings = this.summaryItems[2];
        console.log(this.StarRatings);
      },
      error => {
        this.hideAllObjects = false;
      }
    );
    this.pcorSharedService.getQualityMeasureData().then(qdata => {
      this.qualityMeasureData = JSON.parse(JSON.stringify(qdata));
      console.log(this.qualityMeasureData);
    });
  }
}
