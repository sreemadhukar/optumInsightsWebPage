import { Injectable } from '@angular/core';
import { SelfServiceService } from '../../rest/service-interaction/self-service.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';

@Injectable({ providedIn: ServiceInteractionModule })
export class SelfSharedService {
  private selfServiceData = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private selfService: SelfServiceService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}

  /** The following function is kind of template for the 3 donuts that we have in the Self Service Page
   * The data is corresponding to Utilization Object that we have inside like this
   * SelfServiceInquiries -> ALL -> Utilizations
   */
  public utilizationObjectMethod(title: String, data: any, timeperiod?: String | null): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'donut',
      title: title,
      data: data,
      timeperiod: this.timeFrame
    };
    return temp;
  }

  public getSelfServiceData() {
    this.providerKey = this.session.providerKey();
    this.selfServiceData = [];
    return new Promise(resolve => {
      let parameters;
      let adoptionRate;
      let linkEdiRation;
      let paperLessDelivery;
      const oppurtunities: Array<object> = [];
      const tempArray: Array<object> = [];
      parameters = [this.providerKey];
      /*
      if (this.timeFrame === 'Last 3 Months') {
        parameters = [this.providerKey, true];
      } else {
         this.session.timeFrame = this.timeFrame = 'Last 12 Months';
         parameters = [this.providerKey, true];
      }
      */
      this.selfService.getSelfServiceData(...parameters).subscribe(
        ([providerSystems]) => {
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodStartDate') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodEndDate')
          ) {
            try {
              const startDate: string = this.common.dateFormat(
                providerSystems.SelfServiceInquiries.ALL.ReportingPeriodStartDate
              );
              const endDate: string = this.common.dateFormat(
                providerSystems.SelfServiceInquiries.ALL.ReportingPeriodEndDate
              );
              this.timeFrame = startDate + ' - ' + endDate;
            } catch (Error) {
              this.timeFrame = null;
              console.log('Error in Self Service TimePeriod', this.timeFrame);
            }
          } else {
            this.timeFrame = null;
          }

          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('Utilizations')
          ) {
            const utilization = providerSystems.SelfServiceInquiries.ALL.Utilizations;
            try {
              adoptionRate = this.utilizationObjectMethod(
                'Self Service Adoption Rate',
                {
                  graphValueName: ['Total Patients', 'Completed'],
                  graphValues: [
                    utilization.OverallLinkAdoptionRate * 100,
                    100 - utilization.OverallLinkAdoptionRate * 100
                  ],
                  centerNumber: this.common.percentageFormatter(utilization.OverallLinkAdoptionRate * 100),
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'selfAdoptionRate'],
                  sdata: {
                    sign: 'down',
                    data: '-1.3%'
                  }
                },
                this.timeFrame
              );
            } catch (Error) {
              adoptionRate = this.utilizationObjectMethod(null, null, null);
            } // End try catch for Adoption Rate
            try {
              linkEdiRation = this.utilizationObjectMethod(
                'LINK & EDI to Call Ratio',
                {
                  graphValueName: ['Diabetic Patients', 'Completed'],
                  graphValues: [utilization.LinkAdoptionRate * 100, 100 - utilization.LinkAdoptionRate * 100],
                  centerNumber: this.common.percentageFormatter(utilization.LinkAdoptionRate * 100),
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'linkAndEdiCallRatio'],
                  sdata: {
                    sign: 'up',
                    data: '+1.3%'
                  }
                },
                this.timeFrame
              );
            } catch (Error) {
              linkEdiRation = this.utilizationObjectMethod(null, null, null);
            } // End try catch for Link & EDI Ration
            try {
              paperLessDelivery = this.utilizationObjectMethod(
                'Paperless Delivery',
                {
                  graphValues: [
                    utilization.PaperAndPostageAdoptionRate * 100,
                    100 - utilization.PaperAndPostageAdoptionRate * 100
                  ],
                  centerNumber: this.common.percentageFormatter(utilization.PaperAndPostageAdoptionRate * 100),
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'paperlessDelivery'],
                  sdata: {
                    sign: 'down',
                    data: '-3.7%'
                  }
                },
                this.timeFrame
              );
            } catch (Error) {
              paperLessDelivery = this.utilizationObjectMethod(null, null, null);
            } // End try catch for PaperlessDelivery
          } else {
            adoptionRate = this.utilizationObjectMethod(null, null, null);
            linkEdiRation = this.utilizationObjectMethod(null, null, null);
            paperLessDelivery = this.utilizationObjectMethod(null, null, null);
          } // End if Data not found Utilization Object
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')
          ) {
            try {
              oppurtunities.push({
                category: 'mini-tile',
                title: 'Reduce Calls and Operating Costs by:',
                toggle: this.toggle.setToggles(
                  'Reduce Calls and Operating Costs by:',
                  'Opportunities',
                  'Overview',
                  false
                ),
                data: {
                  centerNumber:
                    '$' +
                    this.common.nFormatter(
                      providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallCost.toFixed(2)
                    ),
                  gdata: []
                },
                fdata: {
                  type: 'bar chart',
                  graphValues: [
                    providerSystems.SelfServiceInquiries.ALL.SelfService.TotalSelfServiceCost.toFixed(),
                    providerSystems.SelfServiceInquiries.ALL.SelfService.TotalPhoneCost.toFixed()
                  ],
                  concatString: '$',
                  color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                  graphValuesTitle: 'Avg. Transaction Costs',
                  graphData1: 'for Self Service',
                  graphData2: 'for Phone Call',
                  gdata: ['card-structure', 'totalCallCost']
                }
              });
            } catch (Error) {
              console.log('Overview Page, Self Service, Data not found for Calls and Operating Cost');
              oppurtunities.push({
                category: 'mini-tile',
                title: null,
                data: null,
                fdata: null
              });
            }
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallTime')
          ) {
            try {
              oppurtunities.push({
                category: 'mini-tile',
                title: "Save Your Staff's Time by:" + '\n\xa0',
                toggle: this.toggle.setToggles("Save Your Staff's Time by:", 'Opportunities', 'Overview', false),
                data: {
                  centerNumber:
                    providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallTime.toFixed(0) + ' Hours/day',
                  gdata: []
                },
                fdata: {
                  type: 'bar chart',
                  graphValues: [
                    providerSystems.SelfServiceInquiries.ALL.SelfService.SelfServiceCallTime.toFixed(0),
                    providerSystems.SelfServiceInquiries.ALL.SelfService.PhoneCallTime.toFixed(0)
                  ],
                  concatString: 'hours',
                  color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                  graphValuesTitle: 'Avg. Processing Times',
                  graphData1: 'for Self Service',
                  graphData2: 'for Phone Call',
                  gdata: ['card-structure', 'saveStaffTime']
                }
              });
            } catch (Error) {
              console.log('Overview Page, Self Service, Data not found for Save Yours Staff Time');
              oppurtunities.push({
                category: 'mini-tile',
                title: null,
                data: null,
                fdata: null
              });
            }
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageClaimProcessingTime')
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Claim Processing Time by:',
              toggle: this.toggle.setToggles('Reduce Claim Processing Time by:', 'Opportunities', 'Overview', false),
              data: {
                centerNumber:
                  (
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed() -
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed()
                  ).toFixed() + ' Days',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed(0),
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed(0)
                ],
                concatString: 'Days',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Mail',
                gdata: ['card-structure', 'reduceClaimProcessingTime']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty(
              'AveragePaperReconsideredProcessingTime'
            ) &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageReconsideredProcessingTime') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService['AveragePaperReconsideredProcessingTime'] !== null &&
            providerSystems.SelfServiceInquiries.ALL.SelfService['AverageReconsideredProcessingTime'] !== null
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Reconsideration Processing by:',
              toggle: this.toggle.setToggles(
                'Reduce Reconsideration Processing by:',
                'Opportunities',
                'Overview',
                false
              ),
              data: {
                centerNumber:
                  (
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed() -
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed()
                  ).toFixed() + ' Days',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed(0),
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed(0)
                ],
                concatString: 'Days',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Mail',
                gdata: ['card-structure', 'reduceReconsiderationProcessing']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }

          tempArray[0] = adoptionRate;
          tempArray[1] = linkEdiRation;
          tempArray[2] = paperLessDelivery;

          this.selfServiceData.push(tempArray, oppurtunities);
          resolve(this.selfServiceData);
        },
        err => {
          console.log('Self Service Error Data', err);
        }
      ); // end subscribing to REST call
    }); // ends Promise
  } // end getSelfServiceData function
} // end export class
