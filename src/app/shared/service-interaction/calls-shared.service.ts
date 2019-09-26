import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/service-interaction/calls.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';
import { TrendingMetricsService } from '../../rest/trending/trending-metrics.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';

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
    private toggle: AuthorizationService,
    private trendsService: TrendingMetricsService
  ) {}

  public issueResolution(
    status: number,
    title: String,
    MetricID: String,
    data: any,
    toggle: boolean,
    besideData: any,
    timeperiod?: String | null
  ): Object {
    const temp: Object = {
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

  public getParameters() {
    let parameters;
    this.providerKey = this.session.providerKeyData();
    this.timeFrame = this.session.filterObjValue.timeFrame;
    if (
      this.timeFrame === 'Last 12 Months' ||
      this.timeFrame === 'Last 6 Months' ||
      this.timeFrame === 'Last 3 Months' ||
      this.timeFrame === 'Last 30 Days' ||
      this.timeFrame === 'Year to Date'
    ) {
      if (this.timeFrame === 'Last 12 Months') {
        parameters = [this.providerKey, { TimeFilter: 'Last12Months' }];
      } else if (this.timeFrame === 'Last 3 Months') {
        parameters = [this.providerKey, { TimeFilter: 'Last3Months' }];
      } else if (this.timeFrame === 'Last 30 Days') {
        parameters = [this.providerKey, { TimeFilter: 'Last30Days' }];
      } else if (this.timeFrame === 'Last 6 Months') {
        parameters = [this.providerKey, { TimeFilter: 'Last6Months' }];
      } else {
        parameters = [this.providerKey, { TimeFilter: 'YTD' }];
      }
    } else {
      parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
    }
    return parameters;
  }

  public getCallsData() {
    return new Promise(resolve => {
      const params = this.getParameters();
      this.sharedCallsData(params)
        .then(data => {
          this.callsData = JSON.parse(JSON.stringify(data));
          if (this.callsData.some(i => i.data === null)) {
            resolve(this.callsData);
          }
          return this.sharedCallsTrend();
        })
        .then(data => {
          const trendsData = JSON.parse(JSON.stringify(data));
          if (trendsData.length) {
            if (trendsData[0][0] === 'QuestionType') {
              this.callsData[0].data['sdata'] = trendsData[0][1];
            }
            if (trendsData[1][0] === 'TalkTime') {
              this.callsData[1].data['sdata'] = trendsData[1][1];
            }
          }
          resolve(this.callsData);
        });
    });
  }
  sharedCallsTrend() {
    this.timeFrame = this.session.filterObjValue.timeFrame;

    return new Promise(resolve => {
      /** Get Calls Trend Data */
      this.providerKey = this.session.providerKeyData();
      this.trendsService.getTrendingMetrics([this.providerKey]).subscribe(
        trends => {
          const trendData: any = [];
          const check: Object = {};
          const totalCallsTrend = ((trends || {}).TendingMtrics || {}).CallsTrendByQuesType;
          if (this.callsData[0].data != null && totalCallsTrend) {
            trendData.push(['QuestionType', this.common.negativeMeansGood(totalCallsTrend)]);
            check['QuestionType'] = this.common.negativeMeansGood(totalCallsTrend);
          }

          const talktimeTrends = trends.TendingMtrics.CcllTalkTimeByQuesType;
          if (this.callsData[1].data != null && talktimeTrends) {
            trendData.push(['TalkTime', this.common.negativeMeansGood(talktimeTrends)]);
            check['TalkTime'] = this.common.negativeMeansGood(talktimeTrends);
          }
          console.log('checkCalls', check);
          resolve(trendData);
        },
        error => {
          console.log('Trend data', error);
        }
      );
    });
  }

  public sharedCallsData(parameters) {
    let callsByCallType: Object;
    let talkTimeByCallType: Object;
    const tempArray: Array<object> = [];
    return new Promise(resolve => {
      this.callsService.getCallsData(...parameters).subscribe(
        ([providerSystems]) => {
          if (providerSystems) {
            const totalCalls = (providerSystems || {}).CallVolByQuesType;
            if (totalCalls) {
              try {
                callsByCallType = this.issueResolution(
                  null,
                  'Calls By Call Type',
                  '303',
                  {
                    graphValueName: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                    graphValues: [
                      totalCalls.BenefitsEligibility,
                      totalCalls.Claims,
                      totalCalls.PriorAuth,
                      totalCalls.Others
                    ],
                    centerNumber:
                      this.common.nondecimalFormatter(totalCalls.Total) < 1
                        ? '< 1'
                        : this.common.nondecimalFormatter(totalCalls.Total),
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                    gdata: ['card-inner', 'callsByCallType'],
                    labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                    hover: true
                    // sdata: this.sdataTrend[0]
                  },
                  this.toggle.setToggles('Calls by Call Type', 'Calls', 'Service Interaction', false),
                  {
                    labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  this.timeFrame
                );
              } catch (Error) {
                console.log('Error in Calls Page | Question Type By Call Type', Error);
                callsByCallType = this.issueResolution(404, null, null, null, null, null);
              }
            } else {
              callsByCallType = this.issueResolution(404, null, null, null, null, null);
            }

            const totalTalkTime = (providerSystems || {}).CallTalkTimeByQuesType;
            if (totalTalkTime) {
              try {
                talkTimeByCallType = this.issueResolution(
                  null,
                  'Talk Time By Call Type',
                  '304',
                  {
                    graphValueName: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
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
                    labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                    hover: true
                    // sdata: this.sdataTrend[1]
                  },
                  this.toggle.setToggles('Talk Time By Call Type', 'Calls', 'Service Interaction', false),
                  {
                    labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                    color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                  },
                  this.timeFrame
                );
              } catch (Error) {
                console.log('Error in Calls Page | TalkTime By Call Type', Error);
                talkTimeByCallType = this.issueResolution(404, null, null, null, null, null);
              }
            } else {
              talkTimeByCallType = this.issueResolution(404, null, null, null, null, null);
            } // end if else block
          } else {
            callsByCallType = this.issueResolution(404, null, null, null, null, null);
            talkTimeByCallType = this.issueResolution(404, null, null, null, null, null);
          }
          tempArray[0] = callsByCallType;
          tempArray[1] = talkTimeByCallType;
          resolve(tempArray);
        },
        err => {
          console.log('Calls Error Data', err);
        }
      );
    });
  }
}
