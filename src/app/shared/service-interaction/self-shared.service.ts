import { Injectable } from '@angular/core';
import { SelfServiceService } from '../../rest/service-interaction/self-service.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';

@Injectable({ providedIn: ServiceInteractionModule })
export class SelfSharedService {
  private selfServiceData = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private MetricidService: GlossaryMetricidService,
    private selfService: SelfServiceService,
    private session: SessionService,
    private common: CommonUtilsService,
    private toggle: AuthorizationService
  ) {}

  /** The following function is kind of template for the 3 donuts that we have in the Self Service Page
   * The data is corresponding to Utilization Object that we have inside like this
   * SelfServiceInquiries -> ALL -> Utilizations
   */
  public utilizationObjectMethod(title: String, MetricID: String, data: any, toggle?: Boolean): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'donut',
      title: title,
      MetricID: MetricID,
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
          const utilization =
            providerSystems && providerSystems.SelfServiceInquiries && providerSystems.SelfServiceInquiries.ALL
              ? providerSystems.SelfServiceInquiries.ALL.Utilizations
              : null;

          if (utilization) {
            try {
              if (utilization.OverallLinkAdoptionRate !== null) {
                adoptionRate = this.utilizationObjectMethod(
                  'Self Service Adoption Rate',
                  this.MetricidService.MetricIDs.SelfServiceAdoptionRate,
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
              } else {
                adoptionRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Self-Service Adoption Rate',
                  MetricID: this.MetricidService.MetricIDs.SelfServiceAdoptionRate,
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
              }
            } catch (Error) {
              console.log('Adopton Rate Self Service', Error);
              adoptionRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Self-Service Adoption Rate',
                MetricID: this.MetricidService.MetricIDs.SelfServiceAdoptionRate,
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
              if (utilization.LinkAdoptionRate !== null) {
                linkEdiRation = this.utilizationObjectMethod(
                  'Link & EDI to Call Ratio',
                  this.MetricidService.MetricIDs.LinkEDItoCallRatio,
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
              } else {
                linkEdiRation = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Link & EDI to Call Ratio',
                  MetricID: this.MetricidService.MetricIDs.LinkEDItoCallRatio,
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
              }
            } catch (Error) {
              linkEdiRation = {
                category: 'app-card',
                type: 'donut',
                title: 'Link & EDI to Call Ratio',
                MetricID: this.MetricidService.MetricIDs.LinkEDItoCallRatio,
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
              if (utilization.PaperAndPostageAdoptionRate !== null) {
                paperLessDelivery = this.utilizationObjectMethod(
                  'Paperless Delivery',
                  this.MetricidService.MetricIDs.PaperlessDelivery,
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
              } else {
                paperLessDelivery = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Paperless Delivery',
                  MetricID: this.MetricidService.MetricIDs.PaperlessDelivery,
                  status: 500,
                  toggle: this.toggle.setToggles('Paperless Delivery', 'Self Service', 'Service Interaction', false),
                  data: null,
                  timeperiod: null
                };
              }
            } catch (Error) {
              paperLessDelivery = {
                category: 'app-card',
                type: 'donut',
                title: 'Paperless Delivery',
                MetricID: this.MetricidService.MetricIDs.PaperlessDelivery,
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
              MetricID: this.MetricidService.MetricIDs.SelfServiceAdoptionRate,
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
            linkEdiRation = {
              category: 'app-card',
              type: 'donut',
              title: 'Link & EDI to Call Ratio',
              MetricID: this.MetricidService.MetricIDs.LinkEDItoCallRatio,
              status: 500,
              toggle: this.toggle.setToggles(
                'Link and EDI to Call Ratio',
                'Self Service',
                'Service Interaction',
                false
              ),
              data: null,
              timeperiod: null
            };
            paperLessDelivery = {
              category: 'app-card',
              type: 'donut',
              title: 'Paperless Delivery',
              MetricID: this.MetricidService.MetricIDs.PaperlessDelivery,
              status: 500,
              toggle: this.toggle.setToggles('Paperless Delivery', 'Self Service', 'Service Interaction', false),
              data: null,
              timeperiod: null
            };
          } // End if Data not found Utilization Object

          /********* Opportunites sections starts from here *********** */
          const selfService =
            providerSystems && providerSystems.SelfServiceInquiries && providerSystems.SelfServiceInquiries.ALL
              ? providerSystems.SelfServiceInquiries.ALL.SelfService
              : null;
          if (selfService) {
            if (
              selfService.hasOwnProperty('TotalCallCost') &&
              selfService.hasOwnProperty('TotalSelfServiceCost') &&
              selfService.hasOwnProperty('TotalPhoneCost')
            ) {
              try {
                let totalCallCost = selfService.TotalCallCost;
                totalCallCost = this.common.nFormatter(totalCallCost);

                oppurtunities.push({
                  category: 'mini-tile',
                  title: 'Reduce Calls and Operating Costs by:',
                  MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
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
                    graphValues: [selfService.TotalSelfServiceCost.toFixed(), selfService.TotalPhoneCost.toFixed()],
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
                  MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
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
                MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
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
            if (selfService.hasOwnProperty('TotalCallTime')) {
              try {
                let totalCalltime: number = selfService.TotalCallTime;
                let totalCalltimeString: string;
                let suffixHourPerDay = ' Hour/day';
                if (totalCalltime < 1 && totalCalltime > 0) {
                  totalCalltimeString = '< 1';
                } else {
                  totalCalltimeString = totalCalltime.toFixed(0);
                  totalCalltime = this.common.nondecimalFormatter(totalCalltime);
                  suffixHourPerDay = ' Hours/day';
                }

                oppurtunities.push({
                  category: 'mini-tile',
                  title: "Save Your Staff's Time by:" + '\n\xa0',
                  MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
                  toggle: this.toggle.setToggles(
                    "Save Your Staff's Time by:",
                    'Self Service',
                    'Service Interaction',
                    false
                  ),
                  data: {
                    centerNumber: totalCalltimeString + suffixHourPerDay,
                    gdata: []
                  },
                  fdata: {
                    type: 'bar chart',
                    graphValues: [selfService.SelfServiceCallTime.toFixed(0), selfService.PhoneCallTime.toFixed(0)],
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
                  MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
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
                MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
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
              selfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
              selfService.hasOwnProperty('AverageClaimProcessingTime')
            ) {
              try {
                let processingTime;
                const checkProcessingTime = +(
                  selfService.AveragePaperClaimProcessingTime - selfService.AverageClaimProcessingTime
                ).toFixed(0);
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
                  MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
                  toggle:
                    this.common.toggleSelfService(checkProcessingTime) &&
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
                      selfService.AverageClaimProcessingTime.toFixed(0),
                      selfService.AveragePaperClaimProcessingTime.toFixed(0)
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
                  MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
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
                MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
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
              selfService.hasOwnProperty('AveragePaperReconsideredProcessingTime') &&
              selfService.hasOwnProperty('AverageReconsideredProcessingTime') &&
              selfService['AveragePaperReconsideredProcessingTime'] !== null &&
              selfService['AverageReconsideredProcessingTime'] !== null
            ) {
              try {
                const checkAvgProcessingTime = +(
                  selfService.AveragePaperReconsideredProcessingTime - selfService.AverageReconsideredProcessingTime
                ).toFixed();
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
                  MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
                  toggle: this.toggle.setToggles(
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
                      selfService.AverageReconsideredProcessingTime.toFixed(0),
                      selfService.AveragePaperReconsideredProcessingTime.toFixed(0)
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
                  MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
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
                MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
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
              MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
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
              MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
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
              MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
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
              MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
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
