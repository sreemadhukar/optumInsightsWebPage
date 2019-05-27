import { Injectable } from '@angular/core';
import { SelfServiceService } from '../../rest/issue-resolution/self-service.service';
import { IssueResolutionPageModule } from '../../components/issue-resolution-page/issue-resolution-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({ providedIn: IssueResolutionPageModule })
export class SelfSharedService {
  private selfServiceData = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private selfService: SelfServiceService,
    private session: SessionService,
    private common: CommonUtilsService
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

  /** The following function is kind of template for the 3 small-bar-graph that we have in the Self Service Page
   * The data is corresponding to SelfService Object that we have inside like this
   * SelfServiceInquiries -> ALL -> SelfService
   */

  public selfServiceObjectMethod(title: String, data: any, timeperiod?: String | null): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'small-bar-chart',
      title: title,
      data: data,
      timeperiod: this.timeFrame
    };
    return temp;
  }

  public callsOperatingCostMethod(
    title: String,
    callCostReduceCostValue: number,
    callCostCallIn90daysValue: number,
    data: any,
    timeperiod?: String | null
  ): Object {
    const temp: Object = {
      title: title,
      callCostReduceCostValue: '$' + this.common.nFormatter(callCostReduceCostValue),
      callCostCallIn90daysValue: this.common.nFormatter(callCostCallIn90daysValue),
      data: data,
      timeperiod: timeperiod
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
      let saveStaffTime;
      let reduceClaimProcessingTime;
      let reduceReconsiderationProcessing;
      const tempArray: Array<object> = [];
      const callsOperatingCostData: Array<Object> = [{}];
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
                  centerNumber: (utilization.OverallLinkAdoptionRate * 100).toFixed(0) + '%',
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
                  centerNumber: (utilization.LinkAdoptionRate * 100).toFixed(0) + '%',
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
                  centerNumber: (utilization.PaperAndPostageAdoptionRate * 100).toFixed(0) + '%',
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
          } // End if else block Utilization Object
          // Started If Else block for Self Service Object
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService')
          ) {
            const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
            try {
              if (
                selfService.PhoneCallTime === undefined ||
                selfService.SelfServiceCallTime === undefined ||
                selfService.TotalCallTime == undefined ||
                selfService.PhoneCallTime === null ||
                selfService.SelfServiceCallTime === null ||
                selfService.TotalCallTime === null
              ) {
                console.log('Self Service Page | Data not found for the Save Your Staff Time by');
                saveStaffTime = this.selfServiceObjectMethod(null, null, null);
              } else {
                saveStaffTime = this.selfServiceObjectMethod(
                  "Save Your Staff's Time by",
                  {
                    chartData: [
                      {
                        labelsRight: this.common.nFormatter(selfService.PhoneCallTime) + ' hours/day',
                        values: selfService.PhoneCallTime.toFixed(),
                        metricName: 'Phone'
                      },
                      {
                        labelsRight: this.common.nFormatter(selfService.SelfServiceCallTime) + ' hours/day',
                        values: selfService.SelfServiceCallTime.toFixed(),
                        metricName: 'Self Service'
                      }
                    ],
                    value: this.common.nFormatter(selfService.TotalCallTime) + ' Hours/day',
                    color: ['#80B0FF', '#3381FF'],
                    gdata: ['card-inner', 'staffTimeSave']
                  },
                  this.timeFrame
                );
              } // end if else block
            } catch (Error) {
              console.log('Error | Self Service Page | Data not found for the Save Your Staff Time by');
              saveStaffTime = this.selfServiceObjectMethod(null, null, null);
            } // End try catch for Save Your's Staff TIme
            try {
              reduceClaimProcessingTime = this.selfServiceObjectMethod(
                'Reduce Claim Processing Time by',
                {
                  chartData: [
                    {
                      labelsRight: selfService.AveragePaperClaimProcessingTime.toFixed(0) + ' days',
                      values: selfService.AveragePaperClaimProcessingTime.toFixed(0),
                      metricName: 'Mail'
                    },
                    {
                      labelsRight: selfService.AverageClaimProcessingTime.toFixed(0) + ' days',
                      values: selfService.AverageClaimProcessingTime.toFixed(0),
                      metricName: 'Self Service'
                    }
                  ],
                  value:
                    selfService.AveragePaperClaimProcessingTime.toFixed(0) -
                    selfService.AverageClaimProcessingTime.toFixed(0) +
                    ' days',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'reduceClaimTime']
                },
                this.timeFrame
              );
            } catch (Error) {
              console.log('Error | Self Service Page | Reduce Claim Processing Time by', Error);
              reduceClaimProcessingTime = this.selfServiceObjectMethod(null, null, null);
            } // End try catch for Reduce Your Claim Processing Time
            try {
              reduceReconsiderationProcessing = this.selfServiceObjectMethod(
                'Reduce Reconsideration Processing by:',
                {
                  chartData: [
                    {
                      labelsRight: this.common.nFormatter(selfService.AveragePaperReconsideredProcessingTime) + ' days',
                      values: selfService.AveragePaperReconsideredProcessingTime.toFixed(),
                      metricName: 'Mail'
                    },
                    {
                      labelsRight: this.common.nFormatter(selfService.AverageReconsideredProcessingTime) + ' days',
                      values: selfService.AverageReconsideredProcessingTime.toFixed(),
                      metricName: 'Self Service'
                    }
                  ],
                  value:
                    this.common.nFormatter(
                      selfService.AveragePaperReconsideredProcessingTime - selfService.AverageReconsideredProcessingTime
                    ) + ' days',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'reduceProcessing']
                },
                this.timeFrame
              );
            } catch (Error) {
              console.log('Error | Self Service Page | Reduce Reconsideration Processing by');
              reduceReconsiderationProcessing = this.selfServiceObjectMethod(null, null, null);
            } // End try Catch for Reduce Reconsideration Processing
          } else {
            saveStaffTime = this.selfServiceObjectMethod(null, null, null);

            reduceClaimProcessingTime = this.selfServiceObjectMethod(null, null, null);

            reduceReconsiderationProcessing = this.selfServiceObjectMethod(null, null, null);
          } // End If Else block SelfService

          /*******  Calls and Operating Costs****** */
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService')
          ) {
            let totalCosts;
            let claimsStatus;
            let eligibilityBenefits;
            let priorAuth;
            const tempCallOperating = providerSystems.SelfServiceInquiries.ALL.SelfService;
            try {
              totalCosts = this.callsOperatingCostMethod(
                'Total Costs',
                this.common.nFormatter(tempCallOperating.TotalCallCost),
                this.common.nFormatter(tempCallOperating.TotalCallCount),
                {
                  chartData: [
                    {
                      labelsRight: this.common.nFormatter(tempCallOperating.TotalPhoneCost) + ' hours/day',
                      values: tempCallOperating.TotalPhoneCost.toFixed(),
                      metricName: 'Phone'
                    },
                    {
                      labelsRight: this.common.nFormatter(tempCallOperating.TotalSelfServiceCost) + ' hours/day',
                      values: tempCallOperating.TotalSelfServiceCost.toFixed(),
                      metricName: 'Self Service'
                    }
                  ],
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'totalCosts']
                },
                this.timeFrame
              );
            } catch (Error) {
              totalCosts = null;
            }
            try {
              claimsStatus = this.callsOperatingCostMethod(
                'Claims Status',
                this.common.nFormatter(tempCallOperating.ReduceClaimCost),
                this.common.nFormatter(tempCallOperating.TotalClaimCallCount),
                {
                  chartData: [
                    {
                      labelsRight: this.common.nFormatter(tempCallOperating.ClaimPhoneCost) + ' hours/day',
                      values: tempCallOperating.ClaimPhoneCost.toFixed(),
                      metricName: 'Phone'
                    },
                    {
                      labelsRight: this.common.nFormatter(tempCallOperating.SelfServicePhoneCost) + ' hours/day',
                      values: tempCallOperating.SelfServicePhoneCost.toFixed(),
                      metricName: 'Self Service'
                    }
                  ],
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'claimsStatus']
                },
                this.timeFrame
              );
            } catch (Error) {
              claimsStatus = null;
            }
            try {
              eligibilityBenefits = this.callsOperatingCostMethod(
                'Eligibilty & Benefits',
                this.common.nFormatter(tempCallOperating.ReduceEligibilityAndBenefitsCost),
                this.common.nFormatter(tempCallOperating.EligibilityAndBenefitCallCount),
                {
                  chartData: [
                    {
                      labelsRight:
                        this.common.nFormatter(tempCallOperating.EligibilityAndBenefitPhoneCost) + ' hours/day',
                      values: tempCallOperating.EligibilityAndBenefitPhoneCost.toFixed(),
                      metricName: 'Phone'
                    },
                    {
                      labelsRight:
                        this.common.nFormatter(tempCallOperating.EligibilityAndBenefitSelfServiceCost) + ' hours/day',
                      values: tempCallOperating.EligibilityAndBenefitSelfServiceCost.toFixed(),
                      metricName: 'Self Service'
                    }
                  ],
                  value: '15 hours/day',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'eligibilityBenefits']
                },
                this.timeFrame
              );
            } catch (Error) {
              eligibilityBenefits = null;
            }
            try {
              priorAuth = this.callsOperatingCostMethod(
                'Prior Authorizations',
                this.common.nFormatter(tempCallOperating.ReducePriorAuthorizationsCost),
                this.common.nFormatter(tempCallOperating.AuthCallCount),
                {
                  chartData: [
                    {
                      labelsRight:
                        this.common.nFormatter(tempCallOperating.PriorAuthorizationsPhoneCost) + ' hours/day',
                      values: tempCallOperating.PriorAuthorizationsPhoneCost.toFixed(),
                      metricName: 'Phone'
                    },
                    {
                      labelsRight:
                        this.common.nFormatter(tempCallOperating.PriorAuthorizationsSelfServiceCost) + ' hours/day',
                      values: tempCallOperating.PriorAuthorizationsSelfServiceCost.toFixed(),
                      metricName: 'Self Service'
                    }
                  ],
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'priorAuth']
                },
                this.timeFrame
              );
            } catch (Error) {
              priorAuth = null;
            }
            callsOperatingCostData[0] = totalCosts;
            callsOperatingCostData[1] = claimsStatus;
            callsOperatingCostData[2] = eligibilityBenefits;
            callsOperatingCostData[3] = priorAuth;
          } else {
            callsOperatingCostData[0] = null;
            callsOperatingCostData[1] = null;
            callsOperatingCostData[2] = null;
            callsOperatingCostData[3] = null;
          }

          /************* */
          tempArray[0] = adoptionRate;
          tempArray[1] = linkEdiRation;
          tempArray[2] = paperLessDelivery;
          tempArray[3] = saveStaffTime;
          tempArray[4] = reduceClaimProcessingTime;
          tempArray[5] = reduceReconsiderationProcessing;

          const removeNullCallsOperatingCost = callsOperatingCostData.filter(function(el) {
            return el != null;
          });
          this.selfServiceData.push(tempArray, removeNullCallsOperatingCost);
          resolve(this.selfServiceData);
        },
        err => {
          console.log('Self service Error Data', err);
        }
      ); // end subscribing to REST call
    }); // ends Promise
  } // end getSelfServiceData function
} // end export class
