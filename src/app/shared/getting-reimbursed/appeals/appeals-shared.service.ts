/* @author gmounika */
import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../../components/getting-reimbursed-page/getting-reimbursed.module';
import { GettingReimbursedService } from '../../../rest/getting-reimbursed/getting-reimbursed.service';
import { CommonUtilsService } from '../../common-utils.service';
import { SessionService } from '../../session.service';
import { AuthorizationService } from '../../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../../glossary-metricid.service';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class AppealsSharedService {
  public nonPaymentData: any = null;
  private tin: string;
  private lob: string;
  private timeFrame: string;
  private providerKey: number;
  private nonPaymentBy: string;
  constructor(
    private MetricidService: GlossaryMetricidService,
    private gettingReimbursedService: GettingReimbursedService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}
  public sharedAppealsYearWiseData(parameters) {
    let appeals: object;
    let appealsSubmitted: object;
    let appealsOverturned: object;
    const summaryData: Array<object> = [];
    return new Promise(resolve => {
      this.gettingReimbursedService.appealsData(...parameters).subscribe(appealsData => {
        const lobFullData = this.common.matchFullLobWithData(this.lob);
        const lobData = this.common.matchLobWithData(this.lob);
        if (appealsData != null && appealsData.hasOwnProperty('status')) {
          appealsSubmitted = {
            category: 'app-card',
            type: 'donutWithLabelBottom',
            status: appealsData.status,
            title: 'Claims Appeals Submitted',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
            data: null,
            besideData: null,
            bottomData: null,
            timeperiod: null
          };
          appealsOverturned = {
            category: 'app-card',
            type: 'donut',
            status: appealsData.status,
            title: 'Claims Appeals Overturned',
            MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
            data: null,
            timeperiod: null
          };
        } else if (appealsData.length > 0 && appealsData[0] != null) {
          if (
            appealsData[0].hasOwnProperty('LineOfBusiness') &&
            appealsData[0].LineOfBusiness !== null &&
            appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
          ) {
            const submittedData = [];
            const labelsData = [];
            const colorsData = [];
            if (appealsData[0].LineOfBusiness.hasOwnProperty('MedicareAndRetirement')) {
              let sum = 0;
              if (
                appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
                appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals;
              }
              if (
                appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals') &&
                appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals;
              }
              submittedData.push(sum);
              labelsData.push('Medicare & Retirement');
              colorsData.push('#3381FF');
            }
            if (appealsData[0].LineOfBusiness.hasOwnProperty('CommunityAndState')) {
              let sum = 0;
              if (
                appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
                appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals;
              }
              if (
                appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
                appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals;
              }
              submittedData.push(sum);
              labelsData.push('Community & State');
              colorsData.push('#80B0FF');
            }
            if (appealsData[0].LineOfBusiness.hasOwnProperty('EmployerAndIndividual')) {
              let sum = 0;
              if (
                appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
                appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals;
              }
              if (
                appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
                appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals;
              }
              submittedData.push(sum);
              labelsData.push('Employer & Individual');
              colorsData.push('#003DA1');
            }

            if (appealsData[0].LineOfBusiness.hasOwnProperty('Uncategorized')) {
              let sum = 0;
              if (
                appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('AdminAppeals') &&
                appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals;
              }
              if (
                appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('ClinicalAppeals') &&
                appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals != null
              ) {
                sum += appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals;
              }
              submittedData.push(sum);
              labelsData.push('Uncategorized');
              colorsData.push('#00B8CC');
            }
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabelBottom',
              title: 'Claims Appeals Submitted',
              MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
              data: {
                graphValues: submittedData,
                centerNumber: this.common.nFormatter(
                  appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                    appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                ),
                color: colorsData,
                gdata: ['card-inner', 'claimsAppealSubmitted'],
                sdata: {
                  sign: '',
                  data: ''
                },
                labels: labelsData,
                hover: true
              },
              besideData: {
                labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
              },
              bottomData: {
                horizontalData: [
                  {
                    values: appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                      ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                      : 0,
                    labels: 'Admin'
                  },
                  {
                    values: appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                      ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                      : 0,
                    labels: 'Clinical'
                  }
                ]
              },
              timeperiod: this.timeFrame
            };
          } else {
            appealsSubmitted = {
              category: 'app-card',
              type: 'donutWithLabelBottom',
              title: 'Claims Appeals Submitted',
              MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
              status: 404,
              data: null,
              besideData: null,
              bottomData: null,
              timeperiod: null
            };
          }
          if (
            appealsData[0].hasOwnProperty('LineOfBusiness') &&
            appealsData[0].LineOfBusiness !== null &&
            appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') != null
          ) {
            const submitted =
              appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
              appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
            const overturnedData = [
              appealsData[0].LineOfBusiness[lobFullData].OverTurnCount,
              submitted - appealsData[0].LineOfBusiness[lobFullData].OverTurnCount
            ];
            appealsOverturned = {
              category: 'app-card',
              type: 'donut',
              title: 'Claims Appeals Overturned',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
              data: {
                graphValues: overturnedData,
                centerNumber: appealsData[0].LineOfBusiness[lobFullData].OverTurnCount
                  ? this.common.nFormatter(appealsData[0].LineOfBusiness[lobFullData].OverTurnCount)
                  : 0,
                color: ['#3381FF', '#D7DCE1'],
                gdata: ['card-inner', 'claimsAppealOverturned'],
                sdata: null
              },
              timeperiod: this.timeFrame
            };
          } else {
            appealsOverturned = {
              category: 'app-card',
              type: 'donut',
              title: 'Claims Appeals Overturned',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
              status: 404,
              data: null,
              timeperiod: null
            };
          }
        } else {
          appealsSubmitted = {
            category: 'app-card',
            type: 'donutWithLabelBottom',
            title: 'Claims Appeals Submitted',
            MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
            status: 404,
            data: null,
            besideData: null,
            bottomData: null,
            timeperiod: null
          };
          appealsOverturned = {
            category: 'app-card',
            type: 'donut',
            title: 'Claims Appeals Overturned',
            MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
            status: 404,
            data: null,
            timeperiod: null
          };
        }

        appeals = {
          id: 1,
          title: 'Claims Appeals',
          MetricID: this.MetricidService.MetricIDs.ClaimsAppeals,
          data: [appealsSubmitted, appealsOverturned]
        };
        summaryData[0] = appeals;
        if (summaryData.length) {
          resolve(summaryData);
        }
      });
    });
  }
  public getappealsRateAndReasonData() {
    this.tin = this.session.filterObjValue.tax.toString().replace(/-/g, '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame; // this.session.timeFrame;
    this.providerKey = this.session.providerKeyData();
    let AOR: Array<Object> = [];
    return new Promise((resolve, reject) => {
      let parameters;
      let appealsOverturnedRate: Object;
      const reason = [];

      if (
        this.timeFrame === 'Last 12 Months' ||
        this.timeFrame === 'Last 6 Months' ||
        this.timeFrame === 'Last 3 Months' ||
        this.timeFrame === 'Last 30 Days' ||
        this.timeFrame === 'Year to Date'
      ) {
        if (this.timeFrame === 'Last 12 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months', AllProviderTins: 'true' }];
          }
        } else if (this.timeFrame === 'Last 3 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months', AllProviderTins: 'true' }];
          }
        } else if (this.timeFrame === 'Last 30 Days') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days', AllProviderTins: 'true' }];
          }
        } else if (this.timeFrame === 'Year to Date') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [this.providerKey, { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'YTD', AllProviderTins: 'true' }];
          }
        } else if (this.timeFrame === 'Last 6 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months', AllProviderTins: 'true' }];
          }
        }
        if (parameters[1].hasOwnProperty('Lob')) {
          delete parameters[1].Lob;
        }
        this.gettingReimbursedService.appealsData(...parameters).subscribe(appealsData => {
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (appealsData != null && appealsData.hasOwnProperty('status')) {
            appealsOverturnedRate = {
              category: 'app-card',
              type: 'donut',
              status: appealsData.status,
              title: 'Claims Appeals Overturned Rate',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
              data: null,
              timeperiod: null
            };
          } else if (appealsData.length > 0 && appealsData[0] != null) {
            if (
              appealsData[0].hasOwnProperty('LineOfBusiness') &&
              appealsData[0].LineOfBusiness !== null &&
              appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
            ) {
              if (appealsData[0].LineOfBusiness[lobFullData].OverTurnCount != null) {
                const submitted =
                  appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                  appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
                const overturned = appealsData[0].LineOfBusiness[lobFullData].OverTurnCount;

                const overturnRate = ((overturned / submitted) * 100).toFixed(0);
                const ornumber = Number(overturnRate);
                appealsOverturnedRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Appeals Overturned Rate',
                  MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                  data: {
                    graphValues: [overturnRate, 100 - ornumber],
                    centerNumber: overturnRate + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'claimsAppealOverturnedRate'],
                    sdata: null
                  },
                  bottomData: {
                    horizontalData: [
                      {
                        values: appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                          ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                          : 0,
                        labels: 'Admin'
                      },
                      {
                        values: appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                          ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                          : 0,
                        labels: 'Clinical'
                      }
                    ]
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                appealsOverturnedRate = {
                  category: 'app-card',
                  type: 'donut',
                  status: 404,
                  title: 'Claims Appeals Overturned Rate',
                  MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                  data: null,
                  timeperiod: null
                };
              }
              if (appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount !== null) {
                if (
                  appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ListReasonAndCount') &&
                  appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount.length > 0
                ) {
                  const reasonsVal1 = [{}];
                  const reasonsVal2 = [{}];
                  const barVal = [{}];
                  const barTitle = [{}];
                  const getTopFiveReasons = appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount.sort(function(
                    a,
                    b
                  ) {
                    return b.Count - a.Count;
                  }).slice(0, 5);
                  let topFiveReasonTotal;
                  for (let i = 0; i < getTopFiveReasons.length; i++) {
                    if (i === 0) {
                      topFiveReasonTotal = getTopFiveReasons[i].Count;
                    } else {
                      topFiveReasonTotal = topFiveReasonTotal + getTopFiveReasons[i].Count;
                    }
                  }
                  for (let a = 0; a < getTopFiveReasons.length; a++) {
                    reasonsVal1[a] = getTopFiveReasons[a].Count;
                    const value1 = Number(reasonsVal1[a]);
                    reasonsVal2[a] = topFiveReasonTotal - getTopFiveReasons[a].Count;
                    barVal[a] =
                      Number(((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed()) >= 1
                        ? ((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed() + '%'
                        : '<1%';
                    barTitle[a] = getTopFiveReasons[a].Reason;
                  }
                  for (let i = 0; i <= getTopFiveReasons.length; i++) {
                    reason.push({
                      type: 'bar chart',
                      graphValues: [reasonsVal1[i], reasonsVal2[i]],
                      barText: barTitle[i],
                      barValue: barVal[i],
                      color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
                      gdata: ['app-card-structure', 'appealsOverturnedReason' + i]
                    });
                  }
                }
              } else {
                reason.push({
                  category: 'app-card',
                  type: 'donut',
                  status: 404,
                  title: 'Top Claims Appeals Overturn Reasons',
                  MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
                  data: null,
                  timeperiod: null
                });
              }
            } else {
              appealsOverturnedRate = {
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Claims Appeals Overturned Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                data: null,
                timeperiod: null
              };
              reason.push({
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Top Claims Appeals Overturn Reasons',
                MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
                data: null,
                timeperiod: null
              });
            }
          } else {
            appealsOverturnedRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Appeals Overturned Rate',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
              data: null,
              timeperiod: null
            };
            reason.push({
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Top Claims Appeals Overturn Reasons',
              MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
              data: null,
              timeperiod: null
            });
          }
          const appealsSubmitted = this.createAppealsDonuts(appealsData, lobFullData).appealsSubmitted;
          const appealsOverturned = this.createAppealsDonuts(appealsData, lobFullData).appealsOverturned;
          AOR = [appealsSubmitted, appealsOverturned, appealsOverturnedRate, reason];
          resolve(AOR);
        });
      } else {
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame,
              Tin: this.tin
            }
          ];
        } else if (this.tin !== 'All') {
          parameters = [
            this.providerKey,
            { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }
          ];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame
            }
          ];
        } else {
          parameters = [
            this.providerKey,
            { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, AllProviderTins: 'true' }
          ];
        }
        if (parameters[1].hasOwnProperty('Lob')) {
          delete parameters[1].Lob;
        }
        this.gettingReimbursedService.appealsData(...parameters).subscribe(appealsData => {
          const lobFullData = this.common.matchFullLobWithData(this.lob);
          const lobData = this.common.matchLobWithData(this.lob);
          if (appealsData !== null && appealsData.hasOwnProperty('status')) {
            appealsOverturnedRate = {
              category: 'app-card',
              type: 'donut',
              status: appealsData.status,
              title: 'Claims Appeals Overturned Rate',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
              data: null,
              timeperiod: null
            };
          } else if (appealsData.length > 0 && appealsData[0] !== null) {
            if (
              appealsData[0].hasOwnProperty('LineOfBusiness') &&
              appealsData[0].LineOfBusiness !== null &&
              appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
              appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
            ) {
              if (appealsData[0].LineOfBusiness[lobFullData].OverTurnCount != null) {
                const submitted =
                  appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                  appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
                const overturned = appealsData[0].LineOfBusiness[lobFullData].OverTurnCount;

                const overturnRate = ((overturned / submitted) * 100).toFixed(0);
                const ornumber = Number(overturnRate);

                appealsOverturnedRate = {
                  category: 'app-card',
                  type: 'donut',
                  title: 'Claims Appeals Overturned Rate',
                  MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                  data: {
                    graphValues: [overturnRate, 100 - ornumber],
                    centerNumber: overturnRate + '%',
                    color: ['#3381FF', '#E0E0E0'],
                    gdata: ['card-inner', 'claimsAppealOverturnedRate'],
                    sdata: null
                  },
                  bottomData: {
                    horizontalData: [
                      {
                        values: 1000 /*appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                          ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                          : 0*/,
                        labels: 'Admin'
                      },
                      {
                        values: 1200 /* appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                          ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                          : 0*/,
                        labels: 'Clinical'
                      }
                    ]
                  },
                  timeperiod: this.timeFrame
                };
              } else {
                appealsOverturnedRate = {
                  category: 'app-card',
                  type: 'donut',
                  status: 404,
                  title: 'Claims Appeals Overturned Rate',
                  MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                  data: null,
                  timeperiod: null
                };
              }
              if (
                appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ListReasonAndCount') &&
                appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount != null
              ) {
                if (appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount.length > 0) {
                  const reasonsVal1 = [{}];
                  const reasonsVal2 = [{}];
                  const barVal = [{}];
                  const barTitle = [{}];
                  const getTopFiveReasons = appealsData[0].LineOfBusiness[lobFullData].ListReasonAndCount.sort(function(
                    a,
                    b
                  ) {
                    return b.Count - a.Count;
                  }).slice(0, 5);
                  let topFiveReasonTotal;
                  for (let i = 0; i < getTopFiveReasons.length; i++) {
                    if (i === 0) {
                      topFiveReasonTotal = getTopFiveReasons[i].Count;
                    } else {
                      topFiveReasonTotal = topFiveReasonTotal + getTopFiveReasons[i].Count;
                    }
                  }
                  for (let a = 0; a < getTopFiveReasons.length; a++) {
                    reasonsVal1[a] = getTopFiveReasons[a].Count;
                    const value1 = Number(reasonsVal1[a]);
                    reasonsVal2[a] = topFiveReasonTotal - getTopFiveReasons[a].Count;
                    barVal[a] =
                      Number(((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed()) >= 1
                        ? ((getTopFiveReasons[a].Count / topFiveReasonTotal) * 100).toFixed() + '%'
                        : '<1%';
                    barTitle[a] = getTopFiveReasons[a].Reason;
                  }
                  for (let i = 0; i <= getTopFiveReasons.length; i++) {
                    reason.push({
                      type: 'bar chart',
                      graphValues: [reasonsVal1[i], reasonsVal2[i]],
                      barText: barTitle[i],
                      barValue: barVal[i],
                      color: ['#3381FF', '#FFFFFF', '#E0E0E0'],
                      gdata: ['app-card-structure', 'appealsOverturnedReason' + i]
                    });
                  }
                } else {
                  reason.push({
                    category: 'app-card',
                    type: 'donut',
                    status: 404,
                    title: 'Top Claims Appeals Overturn Reasons',
                    MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
                    data: null,
                    timeperiod: null
                  });
                }
              } else {
                reason.push({
                  category: 'app-card',
                  type: 'donut',
                  status: 404,
                  title: 'Top Claims Appeals Overturn Reasons',
                  MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
                  data: null,
                  timeperiod: null
                });
              }
            } else {
              appealsOverturnedRate = {
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Claims Appeals Overturned Rate',
                MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
                data: null,
                timeperiod: null
              };
              reason.push({
                category: 'app-card',
                type: 'donut',
                status: 404,
                title: 'Top Claims Appeals Overturn Reasons',
                MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
                data: null,
                timeperiod: null
              });
            }
          } else {
            appealsOverturnedRate = {
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Claims Appeals Overturned Rate',
              MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturnRate,
              data: null,
              timeperiod: null
            };
            reason.push({
              category: 'app-card',
              type: 'donut',
              status: 404,
              title: 'Top Claims Appeals Overturn Reasons',
              MetricID: this.MetricidService.MetricIDs.TopClaimAppealsOverturnReasons,
              data: null,
              timeperiod: null
            });
          }
          const appealsSubmitted = this.createAppealsDonuts(appealsData, lobFullData).appealsSubmitted;
          const appealsOverturned = this.createAppealsDonuts(appealsData, lobFullData).appealsOverturned;
          AOR = [appealsSubmitted, appealsOverturned, appealsOverturnedRate, reason];
          resolve(AOR);
          resolve(AOR);
        });
      }
    });
  }
  public createAppealsDonuts(appealsData, lobFullData) {
    let appealsSubmitted = {};
    let appealsOverturned = {};
    if (appealsData != null && appealsData.hasOwnProperty('status')) {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithLabelBottom',
        status: appealsData.status,
        title: 'Claims Appeals Submitted',
        MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
      appealsOverturned = {
        category: 'app-card',
        type: 'donut',
        status: appealsData.status,
        title: 'Claims Appeals Overturned',
        MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
        data: null,
        timeperiod: null
      };
    } else if (appealsData.length > 0 && appealsData[0] != null) {
      if (
        appealsData[0].hasOwnProperty('LineOfBusiness') &&
        appealsData[0].LineOfBusiness !== null &&
        appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals')
      ) {
        const submittedData = [];
        const labelsData = [];
        const colorsData = [];
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
          appealsData[0].LineOfBusiness.MedicareAndRetirement != null &&
          (lobFullData === 'ALL' || lobFullData === 'MedicareAndRetirement')
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.MedicareAndRetirement.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.MedicareAndRetirement.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Medicare & Retirement');
          colorsData.push('#3381FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('CommunityAndState') &&
          appealsData[0].LineOfBusiness.CommunityAndState != null &&
          (lobFullData === 'ALL' || lobFullData === 'CommunityAndState')
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.CommunityAndState.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.CommunityAndState.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.CommunityAndState.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Community & State');
          colorsData.push('#80B0FF');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('EmployerAndIndividual') &&
          appealsData[0].LineOfBusiness.EmployerAndIndividual != null &&
          (lobFullData === 'ALL' || lobFullData === 'EmployerAndIndividual')
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.EmployerAndIndividual.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.EmployerAndIndividual.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Employer & Individual');
          colorsData.push('#003DA1');
        }
        if (
          appealsData[0].LineOfBusiness.hasOwnProperty('Uncategorized') &&
          appealsData[0].LineOfBusiness.Uncategorized != null &&
          (lobFullData === 'ALL' || lobFullData === 'Uncategorized')
        ) {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.Uncategorized.AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.Uncategorized.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals != null
          ) {
            sum += appealsData[0].LineOfBusiness.Uncategorized.ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Uncategorized');
          colorsData.push('#00B8CC');
        }
        if (lobFullData !== 'ALL') {
          let sum = 0;
          if (
            appealsData[0].LineOfBusiness.ALL.hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness.ALL.AdminAppeals != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
            appealsData[0].LineOfBusiness[lobFullData].AdminAppeals != null
          ) {
            sum +=
              appealsData[0].LineOfBusiness.ALL.AdminAppeals - appealsData[0].LineOfBusiness[lobFullData].AdminAppeals;
          }
          if (
            appealsData[0].LineOfBusiness.ALL.hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness.ALL.ClinicalAppeals != null &&
            appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
            appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals != null
          ) {
            sum +=
              appealsData[0].LineOfBusiness.ALL.ClinicalAppeals -
              appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
          }
          submittedData.push(sum);
          labelsData.push('Other Lines of Business');
          colorsData.push('#D7DCE1');
        }
        const sideData = [];
        if (lobFullData !== 'ALL') {
          const labelsDataNew = labelsData.slice(0, -1);
          const colorsDataNew = colorsData.slice(0, -1);
          sideData[0] = labelsDataNew;
          sideData[1] = colorsDataNew;
        } else {
          sideData[0] = labelsData;
          sideData[1] = colorsData;
        }
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithLabelBottom',
          title: 'Claims Appeals Submitted',
          MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
          data: {
            graphValues: submittedData,
            centerNumber: this.common.nFormatter(
              appealsData[0].LineOfBusiness[lobFullData].AdminAppeals +
                appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
            ),
            color: colorsData,
            gdata: ['card-inner', 'claimsAppealSubmitted'],
            sdata: {
              sign: '',
              data: ''
            },
            labels: labelsData,
            hover: true
          },
          besideData: {
            labels: sideData[0],
            color: sideData[1]
          },
          bottomData: {
            horizontalData: [
              {
                values: appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                  ? appealsData[0].LineOfBusiness[lobFullData].AdminAppeals
                  : 0,
                labels: 'Admin'
              },
              {
                values: appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                  ? appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals
                  : 0,
                labels: 'Clinical'
              }
            ]
          },
          timeperiod: this.timeFrame
        };
      } else {
        appealsSubmitted = {
          category: 'app-card',
          type: 'donutWithLabelBottom',
          title: 'Claims Appeals Submitted',
          MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
          status: 404,
          data: null,
          besideData: null,
          bottomData: null,
          timeperiod: null
        };
      }
      if (
        appealsData[0].hasOwnProperty('LineOfBusiness') &&
        appealsData[0].LineOfBusiness !== null &&
        appealsData[0].LineOfBusiness.hasOwnProperty(lobFullData) &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('OverTurnCount') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('AdminAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].hasOwnProperty('ClinicalAppeals') &&
        appealsData[0].LineOfBusiness[lobFullData].OverTurnCount != null
      ) {
        const sumOverturned = appealsData[0].LineOfBusiness[lobFullData].OverTurnCount;

        let sum = 0;
        if (appealsData[0].LineOfBusiness[lobFullData].AdminAppeals != null) {
          sum += appealsData[0].LineOfBusiness[lobFullData].AdminAppeals;
        }
        if (appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals != null) {
          sum += appealsData[0].LineOfBusiness[lobFullData].ClinicalAppeals;
        }
        const submitted = sum;
        const overturnedData = [sumOverturned, submitted - sumOverturned];
        appealsOverturned = {
          category: 'app-card',
          type: 'donut',
          title: 'Claims Appeals Overturned',
          MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
          data: {
            graphValues: overturnedData,
            centerNumber: this.common.nFormatter(sumOverturned),
            color: ['#3381FF', '#D7DCE1'],
            gdata: ['card-inner', 'claimsAppealOverturned'],
            sdata: null
          },
          timeperiod: this.timeFrame
        };
      } else {
        appealsOverturned = {
          category: 'app-card',
          type: 'donut',
          title: 'Claims Appeals Overturned',
          MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
          status: 404,
          data: null,
          timeperiod: null
        };
      }
    } else {
      appealsSubmitted = {
        category: 'app-card',
        type: 'donutWithLabelBottom',
        title: 'Claims Appeals Submitted',
        MetricID: this.MetricidService.MetricIDs.ClaimsAppealsSubmitted,
        status: 404,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
      appealsOverturned = {
        category: 'app-card',
        type: 'donut',
        title: 'Claims Appeals Overturned',
        MetricID: this.MetricidService.MetricIDs.ClaimAppealsOverturned,
        status: 404,
        data: null,
        timeperiod: null
      };
    }
    return { appealsSubmitted: appealsSubmitted, appealsOverturned: appealsOverturned };
  }
}
