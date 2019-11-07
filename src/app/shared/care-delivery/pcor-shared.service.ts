import { Injectable } from '@angular/core';
import { PcorService } from '../../rest/care-delivery/pcor.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
@Injectable({
  providedIn: CareDeliveryPageModule
})
export class PcorSharedService {
  constructor(
    private MetricidService: GlossaryMetricidService,
    private pcorService: PcorService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}

  /** The following service method is fetching data for
   * 1. Medicare & Retirement Average Star Rating
   * 2. Medicare & Retirement Annual Care Visits Completion Rate
   * 3. Quality Star top level information i.e. star count only
   */

  public getReportingDate(date: String, PCORApi: boolean) {
    if (PCORApi) {
      const PCORMRdate = date;
      const PCORMRyear = PCORMRdate.substr(0, 4);
      const PCORMRmonth = this.common.ReturnMonthlyString(PCORMRdate.substr(4, 4).replace(/[^0-9 ]/g, ''));
      const PCORMRday = parseInt(PCORMRdate.substr(8, 10));
      return PCORMRmonth + ' ' + PCORMRday + ', ' + PCORMRyear;
    } else {
      const PCORMRdate = date;
      const PCORMRmonth = this.common.ReturnMonthlyString(PCORMRdate.substr(0, 2));
      const PCORMRday = parseInt(PCORMRdate.substr(3, 2));
      const PCORMRyear = PCORMRdate.substr(6, 4);
      return PCORMRmonth + ' ' + PCORMRday + ', ' + PCORMRyear;
    }
  }
  public getMRData() {
    return new Promise(resolve => {
      const parametersExecutive = [this.session.providerKeyData(), true];
      this.pcorService.getExecutiveData(...parametersExecutive).subscribe(
        data => {
          if ((data || {}).PatientCareOpportunity) {
            const PCORData = data.PatientCareOpportunity;
            // Reporting Date will be used for all three cards
            const PCORRMReportingDate = this.getReportingDate(data.PatientCareOpportunity.ReportingPeriod, false);
            const PCORMandRData = PCORData.LineOfBusiness.MedicareAndRetirement;

            const totalAllCompletionRate = PCORMandRData.TotalACVs / PCORMandRData.TotalPatientCount;
            const totalDiabeticCompletionRate = PCORMandRData.TotalDiabeticACVs / PCORMandRData.TotalDiabeticPatients;

            const MandRAvgStarRatingCard = [
              {
                category: 'app-card',
                type: 'star',
                title: 'Medicare & Retirement Average Star Rating',
                MetricID: this.MetricidService.MetricIDs.MedicareStarRating,
                data: {
                  graphValues: [PCORMandRData.AverageStarRating],
                  centerNumber: PCORMandRData.AverageStarRating,
                  color: ['#00A8F7', '#D7DCE1', '#FFFFFF'],
                  gdata: ['card-inner', 'pcorCardD3Star']
                },
                sdata: null,
                timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
              }
            ];
            const MandRACVCard = [
              {
                category: 'app-card',
                type: 'donutWithLabelandTab',
                title: 'Medicare & Retirement Annual Care Visits Completion Rate',
                MetricID: this.MetricidService.MetricIDs.MedicareRetirementAnnualCareVisitsCompletionRateDiabetic,
                data: {
                  All: {
                    graphValues: [totalAllCompletionRate, 1 - totalAllCompletionRate],
                    centerNumber: (totalAllCompletionRate * 100).toFixed(0) + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'PCORACVAll']
                  },
                  Diabetic: {
                    graphValues: [totalDiabeticCompletionRate, 1 - totalDiabeticCompletionRate],
                    centerNumber: (totalDiabeticCompletionRate * 100).toFixed(0) + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'PCORACVDiabetic']
                  }
                },
                sdata: {
                  sign: null,
                  data: null
                },
                besideData: {
                  All: {
                    verticalData: [
                      { title: '' },
                      {
                        values: PCORMandRData.TotalPatientCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Total Patients'
                      },
                      {
                        values: PCORMandRData.TotalACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Completed'
                      }
                    ]
                  },
                  Diabetic: {
                    verticalData: [
                      { title: '' },
                      {
                        values: PCORMandRData.TotalDiabeticPatients.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Total Patients'
                      },
                      {
                        values: PCORMandRData.TotalDiabeticACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Completed'
                      }
                    ]
                  }
                },
                timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
              }
            ];

            const PCORCards = [MandRAvgStarRatingCard, MandRACVCard];
            resolve(PCORCards);
            // console.log('PCOR cards', PCORCards);
          } else {
            resolve(null);
          }
        },
        err => {
          console.log('PCOR Error', err);
        }
      );
    });
  }

  /** The following service method is fetching data for
   * 3. Data corresponding to the Quality Star
   *  i.e. the inside level information for the quality star i.e. subCategories
   */

  public getQualityMeasureData() {
    return new Promise(resolve => {
      this.pcorService.getPCORQualityMeasureData([this.session.providerKeyData()]).subscribe(
        data => {
          // console.log('Original Data', data);
          let preparedData: Array<any> = [];
          if (data) {
            // Get Reporting Date
            const reportingDate = this.getReportingDate(data.ReportingPeriod, true);
            // Captilize the first alphabet of the string
            const capitalize = s => {
              if (typeof s !== 'string') {
                return '';
              }
              return s.charAt(0).toUpperCase() + s.slice(1);
            };

            // It contains the star counts array , so that horizontal bar will appear
            const category: Array<Object> = [];

            // It contains the inside level information of the star counts i.e. description, metric details
            const subCategory: Array<Object> = [];

            // So that we can fetch the object from response easily by just looping
            const template = ['', 'one', 'two', 'three', 'four', 'five'];
            const barCountArray = [];
            const completeData = JSON.parse(JSON.stringify(data));
            const escapeSpecialChars = function(string) {
              return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            };
            const asteriskCharacter = escapeSpecialChars('**');

            // ++ output of asterisk character is /*/*
            for (let i = 5; i > 0; i--) {
              const metricName = template[i] + 'StarMeasureCount';
              if (data.hasOwnProperty(metricName)) {
                const m = {
                  star: i,
                  label: capitalize(template[i]) + ' Star Quality Measure',
                  count: completeData[metricName].Count,
                  insideData: completeData[metricName].Data.map(v => {
                    return v.Name.match(new RegExp(asteriskCharacter, 'g'))
                      ? { ...v, message: true }
                      : { ...v, message: false };
                  })
                };
                barCountArray.push(m.count);
                subCategory.push(m);
              } // end if structure
            } // end for loop for sub-category

            const barScaleMax = Math.max(...barCountArray);
            for (let i = subCategory.length; i > 0; i--) {
              const metricName = template[i] + 'StarMeasureCount';
              category.push({
                type: 'singleBarChart',
                star: i,
                title: 'Quality Star Ratings',
                data: {
                  barHeight: 48,
                  barData: completeData[metricName].Count,
                  barSummation: barScaleMax,
                  barText: completeData[metricName].Count,
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'PCORreasonBar' + i],
                  starObject: true,
                  starCount: i
                },
                timeperiod: 'Data represents claims processed as of ' + reportingDate
              });
            }
            preparedData.push(category);
            preparedData.push(subCategory);
          } else {
            preparedData = null;
          }
          // console.log('PCOR Shared Prepared Data', preparedData);
          resolve(preparedData);
        },
        err => {
          console.log('PCOR Quality Star Error', err);
        }
      ); // end observable
    }); // end promise
  } // end getQualityMeasureData method
} // end PcorSharedService class
