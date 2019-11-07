import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
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
  pageSubTitle: String = '';
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
    private pcorService: PcorSharedService,
    private filtermatch: CommonUtilsService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }
  public ratingComponentClick(clickObj: any): void {
    this.pcorService.getMRData().then(data => {
      this.pcorData = JSON.parse(JSON.stringify(data));
      this.starRatings = this.pcorData[2];
    });
  }
  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.pageSubTitle = 'Health System Summary';
    this.loading = true;
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{}];
    this.pcorData = [{}];
    this.qualityMeasureData = [{}];
    this.MRACVCompletionData = [{}];
    this.starRatings = [{}];
    this.PCORTabData = true;

    /** The following service method is fetching data for
     * 1. Medicare & Retirement Average Star Rating
     * 2. Medicare & Retirement Annual Care Visits Completion Rate
     */

    this.pcorService
      .getMRData()
      .then(data => {
        this.loading = false;
        if (data) {
          this.pcorData = JSON.parse(JSON.stringify(data));
          this.MRAStarData = this.pcorData[0];
          this.MRACVCompletionData = this.pcorData[1];
          this.currentTabTitle = this.pcorData[1].title;
        }
      })
      .catch(error => {
        console.log('PCOR', error);
        this.loading = false;
      });

    /** The following service method is fetching data for
     * 3. a) Quality Star top level information i.e. star count only
     *    b) Data corresponding to the Quality Star
             - the inside level information for the quality star i.e. subCategories
     */

    this.pcorService
      .getQualityMeasureData()
      .then(data => {
        const qdata = JSON.parse(JSON.stringify(data));

        if (qdata.length) {
          this.loading = false;
          this.starRatings = qdata[0];
          this.qualityMeasureData = qdata[1];
          console.log('starCount' + qdata[0]);
          console.log('StarCount Details' + qdata[1]);
        }
      })
      .catch(error => {
        console.log('PCOR quality star', error);
        this.loading = false;
      });
  }
}
