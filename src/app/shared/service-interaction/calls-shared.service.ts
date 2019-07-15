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
  private callsData: any;
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

  public getCallsData() {
    this.timeFrame = 'Last 6 Months';
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      let parameters;
      parameters = [this.providerKey];
      this.sharedCallsData(parameters)
        .then(data => {
          this.callsData = data;
          return this.sharedCallsTrend();
        })
        .then(data => {
          this.callsData[0].data['sdata'] = data[0];
          this.callsData[1].data['sdata'] = data[1];
          resolve(this.callsData);
        });
    });
  }
  sharedCallsTrend() {
    return new Promise(resolve => {
      /** Get Calls Trend Data */
      this.callsTrendService
        .getCallsTrendData()
        .then(data => {
          this.sdataTrend = data;
          if (typeof this.sdataTrend[0] === null && typeof this.sdataTrend[1] === null) {
            this.sdataTrend[0] = null;
            this.sdataTrend[1] = null;
          }
          resolve(this.sdataTrend);
        })
        .catch(reason => {
          this.sdataTrend[0] = null;
          this.sdataTrend[1] = null;
          console.log('Calls Service Error ', reason);
        });
      /** Ends Get Calls Trend Data */
    });
  }
  sharedCallsData(parameters) {
    let callsByCallType;
    let talkTimeByCallType;
    let tempArray: Array<object> = [];
    return new Promise(resolve => {
      this.callsService.getCallsData(parameters).subscribe(
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
                      centerNumber: this.common.nondecimalFormatter(totalCalls.Total),
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      gdata: ['card-inner', 'callsByCallType']
                      // sdata: this.sdataTrend[0]
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
                      centerNumber: this.common.nondecimalFormatter(totalCalls.Total) + ' ' + 'Hrs',
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      gdata: ['card-inner', 'talkTimeByCallType']
                      // sdata: this.sdataTrend[1]
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
          } else {
            tempArray = null;
          }
          resolve(tempArray);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
