import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';
import { PcorSharedService } from '../../../shared/care-delivery/pcor-shared.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
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
  pcorLoading: boolean;
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
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService,
    private pcorService: PcorSharedService,
    private filtermatch: CommonUtilsService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }
  public ratingComponentClick(clickObj: any): void {
    this.priorAuthShared.getPCORMandRData().then(data => {
      this.summaryItems = JSON.parse(JSON.stringify(data));
      this.StarRatings = this.summaryItems[2];
    });
  }
  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.loading = true;
    this.pcorLoading = true;
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{}];
    this.summaryItems = [{}];
    this.qualityMeasureData = [{}];
    this.MRACVCompletionData = [{}];
    this.StarRatings = [{}];
    this.PCORTabData = true;

    this.priorAuthShared
      .getPCORMandRData()
      .then(data => {
        this.loading = false;
        this.summaryItems = JSON.parse(JSON.stringify(data));
        this.MRAStarData = this.summaryItems[0];
        this.MRACVCompletionData = this.summaryItems[1];
        this.currentTabTitle = this.summaryItems[1].title;
        this.StarRatings = this.summaryItems[2];
        console.log('Star', this.StarRatings);
      })
      .catch(error => {
        console.log('PCOR', error);
        this.loading = false;
      });

    this.pcorService
      .getQualityMeasureData()
      .then(qdata => {
        this.qualityMeasureData = JSON.parse(JSON.stringify(qdata));
        this.pcorLoading = false;
        console.log('Quaility star component', this.qualityMeasureData);
      })
      .catch(error => {
        console.log('PCOR quality star', error);
        this.pcorLoading = false;
      });
  }
}
