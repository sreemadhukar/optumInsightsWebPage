import { Injectable } from '@angular/core';
import { CallsService } from '../../rest/service-interaction/calls.service';
import { ServiceInteractionModule } from '../../components/service-interaction/service-interaction.module';
import { SessionService } from '../session.service';
import { CommonUtilsService } from '../common-utils.service';
import { TrendingMetricsService } from '../../rest/trending/trending-metrics.service';

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
    private trendsService: TrendingMetricsService
  ) {}

  public issueResolution(
    status: any,
    title: String,
    MetricID: String,
    data: any,
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
      besideData: besideData,
      timeperiod: timeperiod
    };
    return temp;
  }

  public getCallsData() {
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      let parameters;

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
      this.sharedCallsData(parameters)
        .then(data => {
          this.callsData = data;
          return this.sharedCallsTrend();
        })
        .then(data => {
          const temp = JSON.parse(JSON.stringify(data));
          if (this.callsData && data && temp != undefined && temp != null && temp.length > 0) {
            // console.log(temp[0][1]) for QuestionType
            // console.log(temp[1][1]) for TalkTime
            // Removing Calls Trend Line
            const emptyTrends = [
              {
                data: '',
                sign: ''
              },
              {
                data: '',
                sign: ''
              }
            ];
            if (temp[0][0] === 'QuestionType') {
              this.callsData[0].data['sdata'] = emptyTrends[0];
            }
            if (temp[1][0] === 'TalkTime') {
              this.callsData[1].data['sdata'] = emptyTrends[1];
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
          const preparedData: Array<Object> = [];
          if (
            trends != undefined &&
            trends != null &&
            trends.hasOwnProperty('TendingMtrics') &&
            trends.TendingMtrics != null &&
            trends.TendingMtrics.hasOwnProperty('CallsTrendByQuesType') &&
            trends.TendingMtrics.CallsTrendByQuesType != null
          ) {
            const t = this.common.negativeMeansGood(trends.TendingMtrics.CallsTrendByQuesType);
            preparedData.push(['QuestionType', t]);
          }
          if (
            trends != undefined &&
            trends != null &&
            trends.hasOwnProperty('TendingMtrics') &&
            trends.TendingMtrics != null &&
            trends.TendingMtrics.hasOwnProperty('CcllTalkTimeByQuesType') &&
            trends.TendingMtrics.CcllTalkTimeByQuesType != null
          ) {
            const t = this.common.negativeMeansGood(trends.TendingMtrics.CcllTalkTimeByQuesType);
            preparedData.push(['TalkTime', t]);
          }
          resolve(preparedData);
        },
        error => {
          console.log('Trend data', error);
        }
      );
    });
  }

  public sharedCallsData(parameters) {
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
    let callsByCallType;
    let talkTimeByCallType;
    const tempArray: Array<object> = [];
    return new Promise(resolve => {
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
                    {
                      labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                    },
                    this.timeFrame
                  );
                } catch (Error) {
                  console.log('Error in Calls Page | Question Type By Call Type', Error);
                  callsByCallType = this.issueResolution(null, null, null, null);
                }
              }
            } catch (Error) {
              console.log('Calls Page Error CallVolByQuesType', Error);
              callsByCallType = this.issueResolution(null, null, null, null);
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
                    null,
                    'Talk Time By Call Type',
                    '304',
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
                          ? '< 1 Hrs'
                          : this.common.nondecimalFormatter(totalCalls.Total) + ' Hrs',
                      color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                      gdata: ['card-inner', 'talkTimeByCallType'],
                      labels: ['Eligibilty and Benefits', 'Claims', 'Prior Authorizations', 'Others'],
                      hover: true
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
                  talkTimeByCallType = this.issueResolution(null, null, null, null);
                }
              } // end if else blocl
            } catch (Error) {
              console.log('Calls Page Error CallTalkTimeByQuesType', Error);
              talkTimeByCallType = this.issueResolution(null, null, null, null);
            }
            tempArray[0] = callsByCallType;
            tempArray[1] = talkTimeByCallType;
          } else {
            callsByCallType = this.issueResolution(404, null, null, null);
            talkTimeByCallType = this.issueResolution(404, null, null, null);
            tempArray[0] = callsByCallType;
            tempArray[1] = talkTimeByCallType;
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
