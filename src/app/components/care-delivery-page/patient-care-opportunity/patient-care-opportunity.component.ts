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
  customFormatting: Array<Object> = [];
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
  public customFormattingMeasureDescription(customLabelGrid, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].insideData.length; j++) {
        const measurePrefix = data[i].insideData[j].Name;
        for (let k = 0; k < customLabelGrid.length; k++) {
          if (customLabelGrid[k].name === measurePrefix) {
            if (customLabelGrid[k].format === 'newLine') {
              const measureDescription = data[i].insideData[j].Description;
              const periodIndex = data[i].insideData[j].Description.search(/\./);
              const newSentenceOne = measureDescription.slice(0, periodIndex + 1);
              const newSentenceTwo = measureDescription.slice(periodIndex + 1);
              data[i].insideData[j].Description = newSentenceOne;
              data[i].insideData[j].DescriptionTwo = newSentenceTwo;
            }
          }
        }
      }
    }
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
    this.customFormatting = [
      {
        name: 'D10 - Medication Adherence for Diabetes Medications',
        format: 'newLine'
      },
      {
        name: 'DMC15 - Hospitalizations for Potentially Preventable Complications',
        format: 'newLine'
      },
      {
        name: 'C13 - Diabetes Care - Eye Exam',
        format: 'bulletPoint'
      },
      {
        name: 'C22 - Statin Therapy for Patients With Cardiovascular Disease',
        format: 'bulletPoint'
      }
      /*
      {
        name: 'C21',
        format: 'newLine'
      },
      {
        name: 'D14',
        format: 'newLine'
      },
      Will add once ETL change
      */
    ];

    /** The following service method is fetching data for
     * 1. Medicare & Retirement Average Star Rating
     * 2. Medicare & Retirement Annual Care Visits Completion Rate
     * 3. Quality Star top level information i.e. star count only
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
          this.starRatings = this.pcorData[2];
        }
      })
      .catch(error => {
        console.log('PCOR', error);
        this.loading = false;
      });

    /** The following service method is fetching data for
     * 3. Data corresponding to the Quality Star
     *  i.e. the inside level information for the quality star i.e. subCategories
     */

    this.pcorService
      .getQualityMeasureData()
      .then(data => {
        const qdata = JSON.parse(JSON.stringify(data));

        if (qdata.length) {
          this.loading = false;
          this.qualityMeasureData = qdata[0];
        }
        // second number we might have to iterate
        this.customFormattingMeasureDescription(this.customFormatting, qdata[0]);
      })
      .catch(error => {
        console.log('PCOR quality star', error);
        this.loading = false;
      });
  }
}
