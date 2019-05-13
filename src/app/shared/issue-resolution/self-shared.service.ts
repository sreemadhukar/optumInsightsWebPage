import { Injectable } from '@angular/core';
import { SelfServiceService } from '../../rest/issue-resolution/self-service.service';
import { IssueResolutionPageModule } from '../../components/issue-resolution-page/issue-resolution-page.module';
import { SessionService } from '../session.service';

@Injectable({ providedIn: IssueResolutionPageModule })
export class SelfSharedService {
  private selfServiceData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(private selfService: SelfServiceService, private session: SessionService) {}

  /** The following function is kind of template for the 3 donuts that we have in the Self Service Page
   * The data is corresponding to Utilization Object that we have inside like this
   * SelfServiceInquiries -> ALL -> Utilizations
   */
  public utilizationDataObject(title: String, data: any, timeperiod?: String | null): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'donut',
      title: title,
      data: data,
      timeperiod: timeperiod
    };
    return temp;
  }

  /** The following function is kind of template for the 3 small-bar-graph that we have in the Self Service Page
   * The data is corresponding to SelfService Object that we have inside like this
   * SelfServiceInquiries -> ALL -> SelfService
   */

  public selfServiceUtilization(title: String, data: any, timeperiod?: String | null): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'small-bar-chart',
      title: title,
      data: data,
      timeperiod: timeperiod
    };
    return temp;
  }
  public getSelfServiceData() {
    this.timeFrame = 'Last 3 Months';
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
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('Utilizations')
          ) {
            const utilization = providerSystems.SelfServiceInquiries.ALL.Utilizations;
            try {
              adoptionRate = this.utilizationDataObject(
                'Self-Service Adoption Rate',
                {
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
              adoptionRate = this.utilizationDataObject(null, null, null);
            } // End try catch for Adoption Rate
            try {
              linkEdiRation = this.utilizationDataObject(
                'LINK & EDI to Call Ratio',
                {
                  graphValues: [100 - utilization.LinkAdoptionRate * 100, utilization.LinkAdoptionRate * 100],
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
              linkEdiRation = this.utilizationDataObject(null, null, null);
            } // End try catch for Link & EDI Ration
            try {
              paperLessDelivery = this.utilizationDataObject(
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
              paperLessDelivery = this.utilizationDataObject(null, null, null);
            } // End try catch for PaperlessDelivery
          } else {
            adoptionRate = this.utilizationDataObject(null, null, null);
            linkEdiRation = this.utilizationDataObject(null, null, null);
            paperLessDelivery = this.utilizationDataObject(null, null, null);
          } // End if else block Utilization Object
          // Started If Else block for Self Service Object
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService')
          ) {
            const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
            try {
              saveStaffTime = this.selfServiceUtilization(null, null, null);
              /*
              saveStaffTime = this.selfServiceUtilization(
                "Save Your Staff's Time by",
                {
                  chartData: [
                    { labelsRight: '8 hours/day', values: 8, metricName: 'Phone' },
                    { labelsRight: '2 hours/day', values: 2, metricName: 'Self Service' }
                  ],
                  value: selfService.TotalCallTime.toFixed() + ' Hours/day',
                  color: ['#80B0FF', '#3381FF'],
                  gdata: ['card-inner', 'staffTimeSave']
                },
                this.timeFrame
              );
              */
            } catch (Error) {
              saveStaffTime = this.selfServiceUtilization(null, null, null);
            } // End try catch for Save Your's Staff TIme
            try {
              reduceClaimProcessingTime = this.selfServiceUtilization(
                'Reduce Claim Processing Time by',
                {
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
                this.timeFrame
              );
            } catch (Error) {
              console.log('Error | Reduce Claim Processing Time by');
              reduceClaimProcessingTime = this.selfServiceUtilization(null, null, null);
            } // End try catch for Reduce Your Claim Processing Time
            try {
              reduceReconsiderationProcessing = this.selfServiceUtilization(
                'Reduce Reconsideration Processing by:',
                {
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
                this.timeFrame
              );
            } catch (Error) {
              console.log('Error | Reduce Reconsideration Processing by');
              reduceReconsiderationProcessing = this.selfServiceUtilization(null, null, null);
            } // End try Catch for Reduce Reconsideration Processing
          } else {
            saveStaffTime = this.selfServiceUtilization(null, null, null);

            reduceClaimProcessingTime = this.selfServiceUtilization(null, null, null);

            reduceReconsiderationProcessing = this.selfServiceUtilization(null, null, null);
          } // End If Else block SelfService
          tempArray[0] = adoptionRate;
          tempArray[1] = linkEdiRation;
          tempArray[2] = paperLessDelivery;
          tempArray[3] = saveStaffTime;
          tempArray[4] = reduceClaimProcessingTime;
          tempArray[5] = reduceReconsiderationProcessing;
          this.selfServiceData.push(tempArray);
          resolve(this.selfServiceData);
        },
        err => {
          console.log('Self service Error Data', err);
        }
      ); // end subscribing to REST call
    }); // ends Promise
  } // end getSelfServiceData function
} // end export class
