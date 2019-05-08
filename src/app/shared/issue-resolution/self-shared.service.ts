import { Injectable } from '@angular/core';
import { SelfServiceService } from '../../rest/issue-resolution/self-service.service';
import { IssueResolutionPageModule } from '../../components/issue-resolution-page/issue-resolution-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({ providedIn: IssueResolutionPageModule })
export class SelfSharedService {
  private selfServiceData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private selfService: SelfServiceService,
    private common: CommonUtilsService,
    private session: SessionService
  ) {}

  public getSelfServiceData() {
    this.timeFrame = this.session.timeFrame;
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
      parameters = [this.providerKey];
      /*
      if (this.timeFrame === 'Rolling 3 Months') {
        parameters = [this.providerKey, true];
      } else {
         this.session.timeFrame = this.timeFrame = 'Rolling 12 Months';
         parameters = [this.providerKey, true];
      }
      */
      this.selfService.getSelfServiceData(...parameters).subscribe(
        ([providerSystems]) => {
          console.log('Shared providerData', providerSystems);
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('Utilizations')
          ) {
            const utilization = providerSystems.SelfServiceInquiries.ALL.Utilizations;
            try {
              adoptionRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Self-Service Adoption Rate',
                data: {
                  graphValues: [
                    utilization.OverallLinkAdoptionRate * 100,
                    100 - utilization.OverallLinkAdoptionRate * 100
                  ],
                  centerNumber: (utilization.OverallLinkAdoptionRate * 100).toFixed(0) + ' %',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'selfAdoptionRate'],
                  sdata: {
                    sign: 'down',
                    data: '-1.3%'
                  }
                },
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              adoptionRate = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try catch for Adoption Rate
            try {
              linkEdiRation = {
                category: 'app-card',
                type: 'donut',
                title: 'LINK & EDI to Call Ratio',
                data: {
                  graphValues: [100 - utilization.LinkAdoptionRate * 100, utilization.LinkAdoptionRate * 100],
                  centerNumber: (utilization.LinkAdoptionRate * 100).toFixed(0) + ' %',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'linkAndEdiCallRatio'],
                  sdata: {
                    sign: 'up',
                    data: '+1.3%'
                  }
                },
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              linkEdiRation = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try catch for Link & EDI Ration
            try {
              paperLessDelivery = {
                category: 'app-card',
                type: 'donut',
                title: 'Paperless Delivery',
                data: {
                  graphValues: [
                    utilization.PaperAndPostageAdoptionRate * 100,
                    100 - utilization.PaperAndPostageAdoptionRate * 100
                  ],
                  centerNumber: (utilization.PaperAndPostageAdoptionRate * 100).toFixed(0) + ' %',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'paperlessDelivery'],
                  sdata: {
                    sign: 'down',
                    data: '-3.7%'
                  }
                },
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              paperLessDelivery = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try catch for PaperlessDelivery
          } else {
            adoptionRate = {
              category: 'app-card',
              type: 'donut',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };

            linkEdiRation = {
              category: 'app-card',
              type: 'donut',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };

            paperLessDelivery = {
              category: 'app-card',
              type: 'donut',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };
          } // End if else block Utilization
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService')
          ) {
            const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
            try {
              saveStaffTime = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: "Save Your Staff's Time by",
                data: {
                  chartData: [
                    { labelsRight: '8 hours/day', values: 8, metricName: 'Phone' },
                    { labelsRight: '2 hours/day', values: 2, metricName: 'Self Service' }
                  ],
                  value: '6 hours/day',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'staffTimeSave']
                },
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              saveStaffTime = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try catch for Save Your's Staff TIme
            try {
              reduceClaimProcessingTime = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: 'Reduce Claim Processing Time by',
                data: {
                  chartData: [
                    {
                      labelsRight: selfService.AveragePaperClaimProcessingTime.toFixed(0) + ' days',
                      values: selfService.AveragePaperClaimProcessingTime.toFixed(0),
                      metricName: 'Phone'
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
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              reduceClaimProcessingTime = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try catch for Reduce Your Claim Processing Time
            try {
              reduceReconsiderationProcessing = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: 'Reduce Reconsideration Processing by:',
                data: {
                  chartData: [
                    {
                      labelsRight: selfService.AveragePaperReconsideredProcessingTime.toFixed(0) + ' days',
                      values: selfService.AveragePaperReconsideredProcessingTime.toFixed(0),
                      metricName: 'Phone'
                    },
                    {
                      labelsRight: selfService.AverageReconsideredProcessingTime.toFixed(0) + ' days',
                      values: selfService.AverageReconsideredProcessingTime.toFixed(0),
                      metricName: 'Self Service'
                    }
                  ],
                  value:
                    selfService.AveragePaperReconsideredProcessingTime.toFixed(0) -
                    selfService.AverageReconsideredProcessingTime.toFixed(0) +
                    ' days',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'reduceProcessing']
                },
                timeperiod: this.timeFrame
              };
            } catch (Error) {
              reduceReconsiderationProcessing = {
                category: 'app-card',
                type: 'small-bar-chart',
                title: null,
                data: null,
                sdata: null,
                timeperiod: null
              };
            } // End try Catch for Reduce Reconsideration Processing
          } else {
            saveStaffTime = {
              category: 'app-card',
              type: 'small-bar-chart',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };

            reduceClaimProcessingTime = {
              category: 'app-card',
              type: 'small-bar-chart',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };

            reduceReconsiderationProcessing = {
              category: 'app-card',
              type: 'small-bar-chart',
              title: null,
              data: null,
              sdata: null,
              timeperiod: null
            };
          } // End If Else block SelfService
          tempArray[0] = adoptionRate;
          tempArray[1] = linkEdiRation;
          tempArray[2] = paperLessDelivery;
          tempArray[3] = saveStaffTime;
          tempArray[4] = reduceClaimProcessingTime;
          tempArray[5] = reduceReconsiderationProcessing;
          this.selfServiceData.push(tempArray);
          console.log('Self Service', this.selfServiceData);
          resolve(this.selfServiceData);
        },
        err => {
          console.log('Self service Error Data', err);
        }
      ); // end subscribing to REST call
    }); // ends Promise
  } // end getOverviewData function
} // end export class
