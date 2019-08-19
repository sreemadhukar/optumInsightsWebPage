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
  public utilizationObjectMethod(title: String, data: any, toggle?: Boolean): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'donut',
      title: title,
      data: data,
      toggle: toggle,
      timeperiod: this.timeFrame
    };
    return temp;
  }

  public getSelfServiceData() {
    this.providerKey = this.session.providerKeyData();
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
                  sdata: null
                },
                this.toggle.setToggles('Self-Service Adoption Rate', 'Self Service', 'Service Interaction', false)
              );
            } catch (Error) {
              console.log('Erro', Error);
              adoptionRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Self-Service Adoption Rate',
                status: 500,
                toggle: this.toggle.setToggles(
                  'Self-Service Adoption Rate',
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                timeperiod: null
              };
            } // End try catch for Adoption Rate
            try {
              linkEdiRation = this.utilizationObjectMethod(
                'Link & EDI to Call Ratio',
                {
                  graphValueName: ['Diabetic Patients', 'Completed'],
                  graphValues: [utilization.LinkAdoptionRate * 100, 100 - utilization.LinkAdoptionRate * 100],
                  centerNumber: this.common.percentageFormatter(utilization.LinkAdoptionRate * 100),
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'linkAndEdiCallRatio'],
                  sdata: null
                },
                this.toggle.setToggles('Link and EDI to Call Ratio', 'Self Service', 'Service Interaction', false)
                // I used 'and' instead of '&' because special character was failing in doing comparison
              );
            } catch (Error) {
              linkEdiRation = {
                category: 'app-card',
                type: 'donut',
                title: 'Link & EDI to Call Ratio',
                status: 500,
                toggle: this.toggle.setToggles(
                  'Link & EDI to Call Ratio',
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                timeperiod: null
              };
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
                  sdata: null
                },
                this.toggle.setToggles('Paperless Delivery', 'Self Service', 'Service Interaction', false)
              );
            } catch (Error) {
              paperLessDelivery = {
                category: 'app-card',
                type: 'donut',
                title: 'Paperless Delivery',
                status: 500,
                toggle: this.toggle.setToggles('Paperless Delivery', 'Self Service', 'Service Interaction', false),
                data: null,
                timeperiod: null
              };
            } // End try catch for PaperlessDelivery
          } else {
            adoptionRate = {
              category: 'app-card',
              type: 'donut',
              title: 'Self-Service Adoption Rate',
              status: 500,
              toggle: this.toggle.setToggles(
                'Self-Service Adoption Rate',
                'Service Interaction',
                'Self Service',
                false
              ),
              data: null,
              timeperiod: null
            };
            linkEdiRation = {
              category: 'app-card',
              type: 'donut',
              title: 'Link & EDI to Call Ratio',
              status: 500,
              toggle: this.toggle.setToggles('Link & EDI to Call Ratio', 'Self Service', 'Service Interaction', false),
              data: null,
              timeperiod: null
            };
            paperLessDelivery = {
              category: 'app-card',
              type: 'donut',
              title: 'Paperless Delivery',
              status: 500,
              toggle: this.toggle.setToggles('Paperless Delivery', 'Self Service', 'Service Interaction', false),
              data: null,
              timeperiod: null
            };
          } // End if Data not found Utilization Object

          /********* Opportunites sections starts from here *********** */
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries != null &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService')
          ) {
            if (providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')) {
              try {
                let totalCallCost = providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallCost;
                totalCallCost = this.common.nFormatter(totalCallCost);

                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Calls and Operating Costs by:',
                  toggle: this.toggle.setToggles(
                    'Reduce Calls and Operating Costs by:',
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: {
                    centerNumber: '$' + totalCallCost,
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
                console.log('Error - Self Service - Opportunites - Reduce Calls and Operating Costs by:', Error);
                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Calls and Operating Costs by:',
                  status: 500,
                  toggle: this.toggle.setToggles(
                    'Reduce Calls and Operating Costs by:',
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: null,
                  fdata: null
                });
              }
            } else {
              oppurtunities.push({
                category: 'mini-tile',
                title: 'Reduce Calls and Operating Costs by:',
                status: 500,
                toggle: this.toggle.setToggles(
                  'Reduce Calls and Operating Costs by:',
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                fdata: null
              });
            } // end if else for Reduce Calls and Operating Costs by:
            if (providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallTime')) {
              try {
                let totalCalltime = providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallTime;
                let suffixHourPerDay;
                if (totalCalltime < 1 && totalCalltime > 0) {
                  totalCalltime = '< 1';
                  suffixHourPerDay = ' Hour/day';
                } else if (totalCalltime.toFixed(0) === 1) {
                  totalCalltime = totalCalltime.toFixed(0);
                  suffixHourPerDay = ' Hour/day';
                } else if (totalCalltime.toFixed(0) === 0) {
                  totalCalltime = totalCalltime.toFixed(0);
                  suffixHourPerDay = '';
                } else {
                  totalCalltime = this.common.nondecimalFormatter(totalCalltime);
                  suffixHourPerDay = ' Hours/day';
                }

                oppurtunities.push({
                  category: 'mini-tile',
                  title: "Save Your Staff's Time by:" + '\n\xa0',
                  toggle: this.toggle.setToggles(
                    "Save Your Staff's Time by:",
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: {
                    centerNumber: totalCalltime + suffixHourPerDay,
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
                console.log('Error - Self Service - Opportunites - Save Your Staffs Time by:', Error);
                oppurtunities.push({
                  category: 'mini-tile',
                  title: "Save Your Staff's Time by:" + '\n\xa0',
                  status: 500,
                  toggle: this.toggle.setToggles(
                    "Save Your Staff's Time by:",
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: null,
                  fdata: null
                });
              }
            } else {
              oppurtunities.push({
                category: 'mini-tile',
                title: "Save Your Staff's Time by:" + '\n\xa0',
                status: 500,
                toggle: this.toggle.setToggles(
                  "Save Your Staff's Time by:",
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                fdata: null
              });
            } // end if else for Save Your Staff's Time by:
            if (
              providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
              providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageClaimProcessingTime')
            ) {
              try {
                let processingTime;
                const checkProcessingTime =
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed(0) -
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed(0);
                let suffixDay;
                if (checkProcessingTime <= 0) {
                  processingTime = 0;
                  suffixDay = '';
                } else if (checkProcessingTime === 1) {
                  processingTime = checkProcessingTime;
                  suffixDay = ' Day';
                } else {
                  processingTime = this.common.nondecimalFormatter(checkProcessingTime);
                  suffixDay = ' Days';
                }
                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Claim Processing Time by:',
                  toggle:
                    checkProcessingTime >= 0 ||
                    this.toggle.setToggles(
                      'Reduce Claim Processing Time by:',
                      'Self Service',
                      'Service Interaction',
                      false
                    ),
                  data: {
                    centerNumber: processingTime + suffixDay,
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
              } catch (Error) {
                console.log('Error - Self Service - Reduce Claim Processing Time by:', Error);
                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Claim Processing Time by:',
                  status: 500,
                  toggle: this.toggle.setToggles(
                    'Reduce Claim Processing Time by:',
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: null,
                  fdata: null
                });
              }
            } else {
              oppurtunities.push({
                category: 'mini-tile',
                title: 'Reduce Claim Processing Time by:',
                status: 500,
                toggle: this.toggle.setToggles(
                  'Reduce Claim Processing Time by:',
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                fdata: null
              });
            } // end if else for 'Reduce Claim Processing Time by:'
            if (
              providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty(
                'AveragePaperReconsideredProcessingTime'
              ) &&
              providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty(
                'AverageReconsideredProcessingTime'
              ) &&
              providerSystems.SelfServiceInquiries.ALL.SelfService['AveragePaperReconsideredProcessingTime'] !== null &&
              providerSystems.SelfServiceInquiries.ALL.SelfService['AverageReconsideredProcessingTime'] !== null
            ) {
              try {
                const checkAvgProcessingTime =
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed() -
                  providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed();
                let avgProcessingTime;
                let suffixDay;
                if (checkAvgProcessingTime <= 0) {
                  avgProcessingTime = 0;
                  suffixDay = '';
                } else if (checkAvgProcessingTime === 1) {
                  avgProcessingTime = checkAvgProcessingTime;
                  suffixDay = ' Day';
                } else {
                  avgProcessingTime = this.common.nondecimalFormatter(checkAvgProcessingTime);
                  suffixDay = ' Days';
                }
                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Reconsideration Processing by:',
                  toggle:
                    checkAvgProcessingTime >= 0 ||
                    this.toggle.setToggles(
                      'Reduce Reconsideration Processing by:',
                      'Self Service',
                      'Service Interaction',
                      false
                    ),
                  data: {
                    centerNumber: avgProcessingTime + suffixDay,
                    gdata: []
                  },
                  fdata: {
                    type: 'bar chart',
                    graphValues: [
                      providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed(0),
                      providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed(
                        0
                      )
                    ],
                    concatString: 'Days',
                    color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                    graphValuesTitle: 'Avg. Processing Times',
                    graphData1: 'for Self Service',
                    graphData2: 'for Mail',
                    gdata: ['card-structure', 'reduceReconsiderationProcessing']
                  }
                });
              } catch (Error) {
                console.log('Error - Self Service - Reduce Reconsideration Processing by:', Error);
                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Reconsideration Processing by:',
                  status: 500,
                  toggle: this.toggle.setToggles(
                    'Reduce Reconsideration Processing by:',
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: null,
                  fdata: null
                });
              }
            } else {
              oppurtunities.push({
                category: 'mini-tile',
                title: 'Reduce Reconsideration Processing by:',
                status: 500,
                toggle: this.toggle.setToggles(
                  'Reduce Reconsideration Processing by:',
                  'Self Service',
                  'Service Interaction',
                  false
                ),
                data: null,
                fdata: null
              });
            } // end if else for Reduce Reconsideration Processing by:
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Calls and Operating Costs by:',
              status: 500,
              toggle: this.toggle.setToggles(
                'Reduce Calls and Operating Costs by:',
                'Self Service',
                'Service Interaction',
                false
              ),
              data: null,
              fdata: null
            });

            oppurtunities.push({
              category: 'mini-tile',
              title: "Save Your Staff's Time by:" + '\n\xa0',
              status: 500,
              toggle: this.toggle.setToggles(
                "Save Your Staff's Time by:",
                'Self Service',
                'Service Interaction',
                false
              ),
              data: null,
              fdata: null
            });

            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Claim Processing Time by:',
              status: 500,
              toggle: this.toggle.setToggles(
                'Reduce Claim Processing Time by:',
                'Self Service',
                'Service Interaction',
                false
              ),
              data: null,
              fdata: null
            });

            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Reconsideration Processing by:',
              status: 500,
              toggle: this.toggle.setToggles(
                'Reduce Reconsideration Processing by:',
                'Self Service',
                'Service Interaction',
                false
              ),
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
