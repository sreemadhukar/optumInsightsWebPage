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

  public getMRData() {
    return new Promise(resolve => {
      const parametersExecutive = [this.session.providerKeyData(), true];
      this.pcorService.getPCORMedicareData(...parametersExecutive).subscribe(
        data => {
          if (data || {}) {
            const PCORData = data;

            console.log('new data' + PCORData);
            // Reporting Date will be used for all three cards
            const PCORMRdate = PCORData.ReportingPeriod;
            const PCORMRmonth = this.common.ReturnMonthlyString(PCORMRdate.substr(0, 2));
            const PCORMRday = parseInt(PCORMRdate.substr(3, 2));
            const PCORMRyear = PCORMRdate.substr(6, 4);
            const PCORRMReportingDate = PCORMRmonth + ' ' + PCORMRday + ', ' + PCORMRyear;
            // const PCORMandRData = PCORData.LineOfBusiness.MedicareAndRetirement;

            const totalAllCompletionRate = PCORData.TotalACVs / PCORData.TotalPatientCount;
            const totalDiabeticCompletionRate = PCORData.TotalDiabeticACVs / PCORData.TotalDiabeticPatients;

            const MandRAvgStarRatingCard = [
              {
                category: 'app-card',
                type: 'star',
                title: 'Medicare & Retirement Average Star Rating',
                MetricID: this.MetricidService.MetricIDs.MedicareStarRating,
                data: {
                  graphValues: [PCORData.AverageStarRating],
                  centerNumber: PCORData.AverageStarRating,
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
                        values: PCORData.TotalPatientCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Total Patients'
                      },
                      {
                        values: PCORData.TotalACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Completed'
                      }
                    ]
                  },
                  Diabetic: {
                    verticalData: [
                      { title: '' },
                      {
                        values: PCORData.TotalDiabeticPatients.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Total Patients'
                      },
                      {
                        values: PCORData.TotalDiabeticACVs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        labels: 'Completed'
                      }
                    ]
                  }
                },
                timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
              }
            ];

            const countRating = JSON.parse(JSON.stringify(PCORData));
            console.log('rating' + JSON.stringify(countRating.QualityMsrCodeName));
            const ratingvalue = countRating.QualityMsrCodeName.length;
            const PCORRatings = [
              PCORData['5StarRating'],
              PCORData['4StarRating'],
              PCORData['3StarRating'],
              PCORData['2StarRating'],
              PCORData['1StarRating']
            ];
            console.log('rating' + PCORRatings);
            const barScaleMax = Math.max(...PCORRatings);
            console.log('barScaleMax' + barScaleMax);
            const MandRStarRatingCard = [];
            const template = ['0', '1', '2', '3', '4', '5'];
            for (let i = 0; i < PCORRatings.length; i++) {
              const metricName = template[i] + 'StarRating';
              MandRStarRatingCard.push({
                type: 'singleBarChart',
                title: 'Quality Star Ratings',
                MetricID: this.MetricidService.MetricIDs.QualityStarRatings,
                data: {
                  barHeight: 48,
                  barData: PCORRatings[i],
                  barSummation: barScaleMax,
                  barText: PCORRatings[i],
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'PCORreasonBar' + i],
                  starObject: true,
                  starCount: 5 - i
                },
                timeperiod: 'Data represents claims processed as of ' + PCORRMReportingDate
              });
            }

            const PCORCards = [MandRAvgStarRatingCard, MandRACVCard, MandRStarRatingCard];
            resolve(PCORCards);
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
          console.log('Original Data', data);
          const measureData = data;
          console.log('dta', measureData);
          let preparedData: Array<any> = [];
          if (measureData) {
            // Captilize the first alphabet of the string
            const capitalize = s => {
              if (typeof s !== 'string') {
                return '';
              }
              return s.charAt(0).toUpperCase() + s.slice(1);
            };

            const category: Array<Object> = [];
            const subCategory: Array<Object> = [];
            const template = ['0', '1', '2', '3', '4', '5'];
            const accorTitle = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];
            const barCountArray = [];
            const completeData = JSON.parse(JSON.stringify(measureData));
            console.log('completedata' + completeData);
            const escapeSpecialChars = function(string) {
              return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            };
            const asteriskCharacter = escapeSpecialChars('**');

            // ++ output of asterisk character is /*/*
            for (let i = 5; i > 0; i--) {
              const metricName = template[i] + 'StarRating';
              const labelName = accorTitle[i] + ' Star Quality Measure';
              console.log('metric name', metricName);

              if (
                data.QualityMsrCodeName.hasOwnProperty(metricName) &&
                completeData.QualityMsrCodeName[metricName] !== null
              ) {
                const countValue = completeData.QualityMsrCodeName[metricName].length;
                console.log('length' + labelName);
                console.log('counts' + countValue);
                const m = {
                  star: i,
                  label: labelName,
                  count: countValue,
                  insideData: completeData.QualityMsrCodeName[metricName].map(v => {
                    return v.QualityMeasurecodeandname.match(new RegExp(asteriskCharacter, 'g'))
                      ? { ...v, message: true }
                      : { ...v, message: false };
                  })
                };
                barCountArray.push(m.count);
                subCategory.push(m);
                // end if structure
              } else {
                const m = {
                  star: i,
                  label: labelName,
                  count: 0,
                  insideData: null
                };
                barCountArray.push(m.count);
                subCategory.push(m);
              }
            } // end for loop for sub-category
            /*
             We can also fetch the Top Level Categry i.e star count info via this code
             but the loading of 'Quality Star' card is slow , because then it will load
             data at once. So right now we can fetch 'Star Count' from executive api onlt
             In future we can use this code if found useful
 */
            const barScaleMax = Math.max(...barCountArray);
            console.log('subCategory', subCategory);

            for (let i = subCategory.length; i > 0; i--) {
              const metricName = template[i] + 'StarRating';
              console.log('metrinname' + completeData.QualityMsrCodeName[metricName].length);
              category.push({
                type: 'singleBarChart',
                star: i,
                title: 'Quality Star Ratings',
                MetricID: this.MetricidService.MetricIDs.QualityStarRatings,
                data: {
                  barHeight: 48,
                  barData: completeData.QualityMsrCodeName[metricName].length,
                  barSummation: barScaleMax,
                  barText: completeData.QualityMsrCodeName[metricName].length,
                  color: [{ color1: '#3381FF' }],
                  gdata: ['card-inner-large', 'PCORreasonBar' + i],
                  starObject: true,
                  starCount: i
                },
                timeperiod: 'Data represents claims processed as of '
              });
            }

            preparedData.push(category);
            console.log('preparedData', preparedData);
          } else {
            preparedData = null;
          }
          console.log('PCOR Shared Prepared Data', preparedData);
          resolve(preparedData);
        },
        err => {
          console.log('PCOR Quality Star Error', err);
        }
      ); // end observable
    }); // end promise
  } // end getQualityMeasureData method
} // end PcorSharedService class
