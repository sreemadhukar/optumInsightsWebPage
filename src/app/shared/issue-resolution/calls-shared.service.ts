import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/issue-resolution/calls.service';
import { IssueResolutionPageModule } from '../../components/issue-resolution-page/issue-resolution-page.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';

@Injectable({ providedIn: IssueResolutionPageModule })
export class CallsSharedService {
  private callsData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private callsService: CallsService,
    private session: SessionService,
    private common: CommonUtilsService
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
    this.providerKey = this.session.providerKey();
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
                    sdata: {
                      sign: 'down',
                      data: '+7%'
                    }
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
                    sdata: {
                      sign: 'down',
                      data: '+7%'
                    }
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
          resolve(this.callsData);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
