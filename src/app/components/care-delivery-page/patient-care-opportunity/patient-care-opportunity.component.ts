import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
import { PcorSharedService } from '../../../shared/care-delivery/pcor-shared.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { NgRedux } from '@angular-redux/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-patient-care-opportunity',
  templateUrl: './patient-care-opportunity.component.html',
  styleUrls: ['./patient-care-opportunity.component.scss']
})
export class PatientCareOpportunityComponent implements OnInit {
  @Input() printStyle;
  subscription: any;
  pcorData: any;
  qualityMeasureData: any;
  pageTitle: String = '';
  pageSubTitle: String = '';
  pageMainTitle: String = '';
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
  queryParamsObj: any = {};
  reportTitle: String;
  reportText: String;
  reportLink: String;
  subtitle: any;
  printpageSubTitle: String = '';
  isInternal: boolean = environment.internalAccess;
  constructor(
    private checkStorage: StorageService,
    private route: ActivatedRoute,
    private pcorService: PcorSharedService,
    private filtermatch: CommonUtilsService,
    private ngRedux: NgRedux<IAppState>,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'external-link',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/open_in_new-24px.svg')
    );
  }
  public ratingComponentClick(clickObj: any): void {
    this.pcorService.getQualityMeasureData().then(data => {
      this.pcorData = JSON.parse(JSON.stringify(data));
      this.starRatings = this.pcorData[3];
    });
  }
  public locations(substring, string, errorBound) {
    const a = [];
    let i = -1;
    while ((i = string.indexOf(substring, i + 1)) >= 0) {
      a.push(i);
    }
    if (errorBound) {
      const b = [];
      for (let j = 0; j < a.length - 1; j++) {
        if (a[j + 1] - a[j] > 75) {
          b.push(a[j]);
        }
      }
      return b;
    } else {
      return a;
    }
  }
  public customFormattingMeasureDescription(customLabelGrid, data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].insideData) {
        for (let j = 0; j < data[i].insideData.length; j++) {
          const measurePrefix = data[i].insideData[j].QualityMeasurecodeandname;
          for (let k = 0; k < customLabelGrid.length; k++) {
            if (customLabelGrid[k].name === measurePrefix) {
              if (customLabelGrid[k].format === 'newLine') {
                const measureDescription = data[i].insideData[j].MeasureDescription;
                const periodIndex = data[i].insideData[j].MeasureDescription.search(/\./);
                const newSentenceOne = measureDescription.slice(0, periodIndex + 1);
                const newSentenceTwo = measureDescription.slice(periodIndex + 1);
                data[i].insideData[j].MeasureDescription = newSentenceOne;
                data[i].insideData[j].DescriptionTwo = newSentenceTwo;
              } else if (customLabelGrid[k].format === 'bulletPoint') {
                const measureDescription = data[i].insideData[j].MeasureDescription;
                const colonIndex = measureDescription.indexOf(':');
                const newSentenceOne = measureDescription.slice(0, colonIndex + 1);
                const newSentenceTwo = measureDescription.slice(colonIndex + 1);
                data[i].insideData[j].MeasureDescription = newSentenceOne;
                let bulletPointArray;
                if (customLabelGrid[k].name === 'C16 - Controlling Blood Pressure**') {
                  bulletPointArray = this.locations('Members', newSentenceTwo, false);
                } else {
                  bulletPointArray = this.locations('.', newSentenceTwo, true);
                  bulletPointArray.unshift(0);
                }
                const bulletPoints = [];
                for (let l = 0; l < bulletPointArray.length; l++) {
                  if (bulletPointArray[l + 1] === undefined) {
                    const preSentence = newSentenceTwo
                      .slice(bulletPointArray[l])
                      .split('.')
                      .join('')
                      .trim();
                    bulletPoints.push('•' + preSentence);
                  } else {
                    const preSentence = newSentenceTwo
                      .slice(bulletPointArray[l], bulletPointArray[l + 1])
                      .split('.')
                      .join('')
                      .trim();
                    bulletPoints.push('•' + preSentence);
                  }
                }
                data[i].insideData[j].DescriptionBulletPoints = bulletPoints;
              }
            }
          }
        }
      }
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams && queryParams.selectedItemId) {
        this.selectedItemId = queryParams.selectedItemId;
      }
      if (this.router.url.includes('print-')) {
        this.subtitle = true;
        this.printStyle = true;
      }
      this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'pcorPage' });
      this.pageTitle = 'Patient Care Opportunity–Medicare';
      this.pageSubTitle = 'Health System Summary';
      this.pageMainTitle = this.sessionService.getHealthCareOrgName();
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
          name: 'C13 - Diabetes Care - Eye Exam',
          format: 'bulletPoint'
        },
        {
          name: 'C22 - Statin Therapy for Patients With Cardiovascular Disease',
          format: 'bulletPoint'
        },
        {
          name: 'C16 - Controlling Blood Pressure**',
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
         {
         name: 'D10 - Medication Adherence for Diabetes Medications',
         format: 'newLine'
         },
         {
         name: 'DMC15 - Hospitalizations for Potentially Preventable Complications',
         format: 'newLine'
         },
         Will add once ETL change
         */
      ];

      /** The following service method is fetching data for
       * 1. Medicare Average Star Rating
       * 2. Medicare Annual Care Visits Completion Rate
       * 3. Quality Star top level information i.e. star count only
       */
      /** The following service method is fetching data for
       * 3. Data corresponding to the Quality Star
       *  i.e. the inside level information for the quality star i.e. subCategories
       */

      this.pcorService
        .getQualityMeasureData()
        .then(data => {
          this.loading = false;
          if (data) {
            this.pcorData = JSON.parse(JSON.stringify(data));

            this.MRAStarData = this.pcorData[0];
            this.MRACVCompletionData = this.pcorData[1];
            this.currentTabTitle = this.pcorData[1].title;
            if (this.pcorData.length) {
              this.loading = false;

              this.qualityMeasureData = this.pcorData[2];
            }
            // second number we might have to iterate
            this.customFormattingMeasureDescription(this.customFormatting, this.pcorData[2]);
            this.starRatings = this.pcorData[3];
          }
        })

        .catch(error => {
          console.log('PCOR quality star', error);
          this.loading = false;
        });
    });
    this.reportTitle = 'View the PCOR Report';
    this.reportText = 'View in-depth details of your health system in the PCOR report. ';
    this.reportLink = 'View the Patient Care Opportunity Report';
  }
  PCORreport() {
    if (this.isInternal) {
      window.open('https://webep1428/PCORMRPROD/');
    } else {
      window.open('https://www.uhcprovider.com/en/reports-quality-programs/physician-perf-based-comp.html');
    }
  }
}
