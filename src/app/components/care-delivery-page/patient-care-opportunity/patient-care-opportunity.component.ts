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
  pcorData: any;
  qualityMeasureData: any;
  pageTitle: String = '';
  loading: boolean;
  pcorBoolean: boolean;
  pcorLoading: boolean;
  MRAStarData: any;
  MRACVCompletionData: any;
  starRatings: any;
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
      this.pcorData = JSON.parse(JSON.stringify(data));
      this.starRatings = this.pcorData[2];
    });
  }
  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.loading = true;
    this.pcorLoading = true;
    this.pcorBoolean = false;
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{}];
    this.pcorData = [{}];
    this.qualityMeasureData = [{}];
    this.MRACVCompletionData = [{}];
    this.starRatings = [{}];
    this.PCORTabData = true;

    this.priorAuthShared
      .getPCORMandRData()
      .then(data => {
        this.loading = false;
        if (data) {
          this.pcorData = JSON.parse(JSON.stringify(data));
          this.MRAStarData = this.pcorData[0];
          this.MRACVCompletionData = this.pcorData[1];
          this.currentTabTitle = this.pcorData[1].title;
          this.starRatings = this.pcorData[2];
        }
      })
      .catch(error => {
        console.log('PCOR', error);
        this.loading = false;
        this.pcorBoolean = false;
      });

    this.pcorService
      .getQualityMeasureData()
      .then(qdata => {
        this.pcorLoading = false;
        if (qdata) {
          this.loading = false;
          this.pcorBoolean = true;
          this.qualityMeasureData = JSON.parse(JSON.stringify(qdata));
        }
      })
      .catch(error => {
        console.log('PCOR quality star', error);
        this.pcorLoading = false;
        this.pcorBoolean = false;
        this.loading = false;
      });
  }
}
