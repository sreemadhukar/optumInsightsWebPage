import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/service-interaction/calls.service';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GettingReimbursedPayload } from '../getting-reimbursed/payload.class';
import { ICallsShared } from '../../modals/i-calls-shared';
import { ICallsResponse } from 'src/app/modals/i-calls';

@Injectable({ providedIn: 'root' })
export class CallsSharedService {
  public sdataQuestionType: object;
  public sdataTalkTime: object;
  public sdataTrend: any = null;
  private callsData: any;
  private providerKey: number;

  constructor(
    private callsService: CallsService,
    private session: SessionService,
    private common: CommonUtilsService,
    private readonly toggle: AuthorizationService
  ) {}

  public issueResolution(
    status: number,
    title: string,
    MetricID: string,
    data: any,
    toggle: boolean,
    besideData: any,
    timeperiod?: string | null
  ): ICallsShared {
    const temp: ICallsShared = {
      category: 'app-card',
      type: 'donutWithLabel',
      status: status,
      title: title,
      MetricID: MetricID,
      data: data,
      toggle: toggle,
      besideData: besideData,
      timeperiod: timeperiod
    };
    return temp;
  }

  public getParameters(param) {
    let parameters = [];
    this.providerKey = this.session.providerKeyData();
    parameters = [this.providerKey, new GettingReimbursedPayload(param)];
    return parameters;
  }

  public getCallsData(param) {
    return new Promise(resolve => {
      const params = this.getParameters(param);
      this.sharedCallsData(params).then(data => {
        this.callsData = data;
        resolve(this.callsData);
      });
    });
  }

  public createCallsByCallType(totalCalls, timePeriodCalls) {
    try {
      const callsCounts = [totalCalls.BenefitsEligibility, totalCalls.Claims, totalCalls.PriorAuth, totalCalls.Others];
      const callsLabels = ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'];

      return this.issueResolution(
        null,
        'Calls By Call Type',
        '303',
        {
          graphValueName: ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
          graphValues: [totalCalls.BenefitsEligibility, totalCalls.Claims, totalCalls.PriorAuth, totalCalls.Others],
          centerNumber:
            this.common.nondecimalFormatter(totalCalls.Total) < 1
              ? '< 1'
              : this.common.nondecimalFormatter(totalCalls.Total),
          color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
          gdata: ['card-inner', 'callsByCallType'],
          labels: ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
          hover: true
          // sdata: this.sdataTrend[0]
        },
        this.toggle.setToggles('Calls by Call Type', 'Calls', 'Service Interaction', false),
        {
          labels: this.common.sideLabelWords(callsCounts, callsLabels),
          color: this.common.sideLabelColor(callsCounts)
        },
        timePeriodCalls
      );
    } catch (Error) {
      console.log('Error in Calls Page | Question Type By Call Type', Error);
      return this.issueResolution(404, 'Calls by Call Type', null, null, null, null);
    }
  }

  public createCallTalkTimeByQuesType(totalTalkTime, timePeriodCalls) {
    try {
      const talkTimeCounts = [
        totalTalkTime.BenefitsEligibility,
        totalTalkTime.Claims,
        totalTalkTime.PriorAuth,
        totalTalkTime.Others
      ];
      const talkTimeLabels = ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'];
      return this.issueResolution(
        null,
        'Talk Time By Call Type',
        '304',
        {
          graphValueName: ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
          graphValues: [
            totalTalkTime.BenefitsEligibility,
            totalTalkTime.Claims,
            totalTalkTime.PriorAuth,
            totalTalkTime.Others
          ],
          centerNumber:
            this.common.nondecimalFormatter(totalTalkTime.Total) < 1
              ? '< 1 Hrs'
              : this.common.nondecimalFormatter(totalTalkTime.Total) + ' Hrs',
          color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
          gdata: ['card-inner', 'talkTimeByCallType'],
          labels: ['Eligibility and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
          hover: true
          // sdata: this.sdataTrend[1]
        },
        this.toggle.setToggles('Talk Time By Call Type', 'Calls', 'Service Interaction', false),
        {
          labels: this.common.sideLabelWords(talkTimeCounts, talkTimeLabels),
          color: this.common.sideLabelColor(talkTimeCounts)
        },
        timePeriodCalls
      );
    } catch (Error) {
      console.log('Error in Calls Page | TalkTime By Call Type', Error);
      return this.issueResolution(404, 'Talk Time By Call Type', null, null, null, null);
    }
  }

  public sharedCallsData(parameters) {
    let callsByCallType: ICallsShared;
    let talkTimeByCallType: ICallsShared;
    const tempArray: Array<object> = [];
    return new Promise(resolve => {
      this.callsService.getCallsData(...parameters).subscribe(
        (response: ICallsResponse) => {
          if (response.Data) {
            const providerSystems = response.Data;
            const startDate = providerSystems.ReportStartDate;
            const endDate = providerSystems.ReportEndDate;
            const timePeriodCalls: string =
              this.common.dateFormat(startDate) + '&ndash;' + this.common.dateFormat(endDate);
            if (providerSystems.CallVolByQuesType) {
              callsByCallType = this.createCallsByCallType(providerSystems.CallVolByQuesType, timePeriodCalls);
            } else {
              callsByCallType = this.issueResolution(404, 'Calls by Call Type', null, null, null, null);
            }

            if (providerSystems.CallTalkTimeByQuesType) {
              talkTimeByCallType = this.createCallTalkTimeByQuesType(
                providerSystems.CallTalkTimeByQuesType,
                timePeriodCalls
              );
            } else {
              talkTimeByCallType = this.issueResolution(404, 'Talk Time By Call Type', null, null, null, null);
            }
          } else {
            callsByCallType = this.issueResolution(404, 'Calls by Call Type', null, null, null, null);
            talkTimeByCallType = this.issueResolution(404, 'Talk Time By Call Type', null, null, null, null);
          }

          tempArray[0] = callsByCallType;
          tempArray[1] = talkTimeByCallType;
          resolve(tempArray);
        },
        err => {
          const respArray: Array<object> = [];
          console.log('Calls Error Data', err);
          callsByCallType = this.issueResolution(404, 'Calls by Call Type', null, null, null, null);
          talkTimeByCallType = this.issueResolution(404, 'Talk Time By Call Type', null, null, null, null);
          respArray[0] = callsByCallType;
          respArray[1] = talkTimeByCallType;
          resolve(respArray);
        }
      );
    });
  }
}
