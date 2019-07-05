import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/service-interaction/calls.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';
import { CallsTrendService } from './calls-trend.service';

@Injectable({ providedIn: ServiceInteractionModule })
export class CallsSharedService {
  public sdataQuestionType: object;
  public sdataTalkTime: object;
  public sdataTrend: any = null;
  private callsData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;

  constructor(
    private callsService: CallsService,
    private session: SessionService,
    private common: CommonUtilsService,
    private callsTrendService: CallsTrendService
  ) {}

  public issueResolution(title: String, data: any, besideData: any, timeperiod?: String | null): Object {
    const temp: Object = {
      category: 'app-card',
      type: 'donutWithLabel',
      title: title,
      data: data,
      besideData: besideData,
      timeperiod: timeperiod
    };
    return temp;
  }

  public getCallsTrendData1() {
    this.providerKey = this.session.providerKeyData();
    this.callsData = [];
    let parameters;
    parameters = [this.providerKey, 'PreviousLast30Days', 'Last30Days'];

    this.callsService.getCallsTrendData(...parameters).subscribe(
      ([previousLast, lastTrend]) => {
        console.log(previousLast, lastTrend);
        if (
          lastTrend != null &&
          previousLast != null &&
          typeof lastTrend === 'object' &&
          typeof previousLast === 'object'
        ) {
          this.sdataQuestionType = this.common.last30DaysTrend(
            lastTrend.CallVolByQuesType.Total,
            previousLast.CallVolByQuesType.Total
          );
          this.sdataTalkTime = this.common.last30DaysTrend(
            lastTrend.CallTalkTimeByQuesType.Total,
            previousLast.CallTalkTimeByQuesType.Total
          );
        } else {
          this.sdataQuestionType = null;
          this.sdataTalkTime = null;
        }
      },
      err => {
        console.log('Calls Trend Error Data', err);
      }
    );
  }

  public getCallsData() {
    /** Get Calls Trend Data */
    this.callsTrendService
      .getCallsTrendData()
      .then(data => {
        this.sdataTrend = data;
        if (typeof this.sdataTrend[0] === null && typeof this.sdataTrend[1] === null) {
          this.sdataTrend[0] = null;
          this.sdataTrend[1] = null;
        }
        console.log('Calls Shared Trend Data', data);
      })
      .catch(reason => {
        console.log('Calls Service Error ', reason);
      });
    /** Ends Get Calls Trend Data */

    this.timeFrame = 'Last 6 Months';
    this.providerKey = this.session.providerKeyData();
    this.callsData = [];
    return new Promise(resolve => {
      let parameters;
      let callsByCallType;
      let talkTimeByCallType;
      parameters = [this.providerKey];
      const tempArray: Array<object> = [];
      /*
      if (this.timeFrame === 'Last 3 Months') {
        parameters = [this.providerKey, true];
      } else {
         this.session.timeFrame = this.timeFrame = 'Last 12 Months';
         parameters = [this.providerKey, true];
      }
      */
      this.callsService.getCallsData(...parameters).subscribe(
        ([providerSystems]) => {
          if (providerSystems != null) {
            try {
              if (
                providerSystems.CallVolByQuesType != null &&
                providerSystems.CallVolByQuesType != undefined &&
                providerSystems.hasOwnProperty('CallVolByQuesType')
              ) {
                const totalCalls = providerSystems.CallVolByQuesType;
                try {
                  callsByCallType = this.issueResolution(
                    'Calls By Call Type',
                    {
                      graphValueName: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      graphValues: [
                        totalCalls.BenefitsEligibility,
                        totalCalls.Claims,
                        totalCalls.PriorAuth,
                        totalCalls.Others
                      ],
                      centerNumber: this.common.nFormatter(totalCalls.Total),
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      gdata: ['card-inner', 'callsByCallType'],
                      sdata: this.sdataTrend[0]
                    },
                    {
                      labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                    },
                    this.timeFrame
                  );
                } catch (Error) {
                  console.log('Error in Calls Page | Question Type By Call Type', Error);
                  callsByCallType = this.issueResolution(null, null, null);
                }
              }
            } catch (Error) {
              console.log('Calls Page Error CallVolByQuesType', Error);
              callsByCallType = this.issueResolution(null, null, null);
            }
            try {
              if (
                providerSystems.CallTalkTimeByQuesType != undefined &&
                providerSystems.CallTalkTimeByQuesType != null &&
                providerSystems.hasOwnProperty('CallTalkTimeByQuesType')
              ) {
                const totalCalls = providerSystems.CallTalkTimeByQuesType;
                try {
                  talkTimeByCallType = this.issueResolution(
                    'Talk Time By Call Type',
                    {
                      graphValueName: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      graphValues: [
                        totalCalls.BenefitsEligibility,
                        totalCalls.Claims,
                        totalCalls.PriorAuth,
                        totalCalls.Others
                      ],
                      centerNumber: this.common.nFormatter(totalCalls.Total) + 'Hrs',
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      gdata: ['card-inner', 'talkTimeByCallType'],
                      sdata: this.sdataTrend[1]
                    },
                    {
                      labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                    },
                    this.timeFrame
                  );
                } catch (Error) {
                  console.log('Error in Calls Page | TalkTime By Call Type', Error);
                  talkTimeByCallType = this.issueResolution(null, null, null);
                }
              } // end if else blocl
            } catch (Error) {
              console.log('Calls Page Error CallTalkTimeByQuesType', Error);
              talkTimeByCallType = this.issueResolution(null, null, null);
            }
            tempArray[0] = callsByCallType;
            tempArray[1] = talkTimeByCallType;
            this.callsData.push(tempArray);
          } else {
            this.callsData = null;
          }
          resolve(this.callsData);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
