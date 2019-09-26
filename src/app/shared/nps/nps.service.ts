import { Injectable } from '@angular/core';
import { NPSService } from 'src/app/rest/nps/nps.service';
export interface NPSParams {
  filter: string;
}
@Injectable({
  providedIn: 'root'
})
export class NPSSharedService {
  filters: any = [
    {
      title: 'Last Completed Quarter',
      key: 1,
      selected: true,
      params: 'LAST_COMPLETED_QUARTER',
      rules: {
        nps: {
          timeFrameText: 'Quarter and Year',
          singleCard: true
        },
        careDelivery: {
          singleCard: true
        }
      }
    },
    {
      title: 'Year To Date',
      key: 2,
      selected: false,
      params: 'YEAR_TO_DATE',
      rules: {
        nps: {
          timeFrameText: 'Year',
          singleCard: true
        },
        careDelivery: {
          singleCard: true
        }
      }
    },
    {
      title: 'Quarter on Quarter',
      key: 3,
      selected: false,
      params: 'QUARTER_OVER_QUARTER',
      rules: {
        nps: {
          timeFrameText: 'Quarter vs Quarter',
          quarterFormat: 'Quarter and Year',
          singleCard: false
        },
        careDelivery: {
          singleCard: false
        }
      }
    },
    {
      title: 'Total Last Year',
      key: 4,
      selected: false,
      params: 'TOTAL_LAST_YEAR',
      rules: {
        nps: {
          timeFrameText: 'Year',
          singleCard: false,
          quarterFormat: 'Year',
          dependent: {
            key: 2
          }
        },
        careDelivery: {
          singleCard: false
        }
      }
    }
  ];
  constructor(private npsRestService: NPSService) {}

  public getNPSSummary(params: NPSParams, callback: any) {
    const { rules, title: currentFilter } = this.filters.filter((filterItem: any) => filterItem.selected)[0];
    const {
      nps: { singleCard, timeFrameText, quarterFormat },
      careDelivery: { singleCard: careDelivery_singleCard }
    } = rules;

    const result = {
      npsSummary: {
        title: 'Provider NPS Summary',
        timeFrame: '',
        quarters: [],
        all: {
          data: {
            type: 'nps',
            quarter: true,
            singleCard,
            title: 'Combined Total NPS',
            sdata: {
              sign: 'up',
              data: 'Positive Trending',
              trendStyleNPS: true
            },
            cards: []
          }
        },
        md: {
          data: {
            type: 'nps',
            quarter: true,
            singleCard,
            title: 'Physician NPS',
            sdata: {
              sign: 'up',
              data: 'Positive Trending',
              trendStyleNPS: true
            },
            cards: []
          }
        },
        pm: {
          data: {
            type: 'nps',
            quarter: true,
            singleCard,
            title: 'Practice Manager NPS',
            sdata: {
              sign: 'up',
              data: 'Positive Trending',
              trendStyleNPS: true
            },
            cards: []
          }
        }
      },
      careDelivery: {
        data: {
          title: 'Care Delivery',
          timeperiod: '',
          chartData: [
            {
              quarters: [],
              cardType: 'horizontalBar',
              key: 'PriorAuthTurnTime',
              subKey: 'PriorAuthTurnTimeValue',
              units: 'hours',
              caption: 'Avg. Prior Auth turnaround time',
              singleCard: careDelivery_singleCard,
              report: false,
              color: ['#3381FF', '#80B0FF'],
              sdata: {
                sign: 'up',
                data: 'Positive Trending'
              }
            },
            {
              quarters: [],
              cardType: 'verticalBar',
              key: 'PriorAuthRequested',
              subKey: 'PriorAuthRequestedValue',
              units: 'K',
              singleCard: careDelivery_singleCard,
              caption: 'Prior auths requested',
              report: false,
              color: ['#3381FF', '#80B0FF'],
              sdata: {
                sign: 'up',
                data: 'Positive Trending'
              }
            },
            {
              quarters: [],
              cardType: 'hollowbox',
              key: 'LinkPriorAuthNPS',
              subKey: 'LinkPriorAuthNPSValue',
              singleCard: careDelivery_singleCard,
              units: '',
              report: true,
              caption: 'Link Prior Auth NPS',
              sdata: {
                sign: 'up',
                data: 'Positive Trending'
              }
            },
            {
              quarters: [],
              cardType: 'miniDonut',
              key: 'EaseOfMedicalAuth',
              subKey: 'EaseOfMedicalAuthValue',
              singleCard: careDelivery_singleCard,
              graphValues: [],
              units: '%',
              report: true,
              caption: 'Ease of Medical Prior Auth (excl radiology)',
              color: ['#3381FF', '#E0E0E0'],
              sdata: {
                sign: 'up',
                data: 'Positive Trending'
              }
            }
          ]
        }
      },
      networkParticipation: { data: [] },
      reimbursement: { data: [] },
      issueResolution: { data: [] },
      engagement: { data: [] }
    };
    const paramsArray = this.getNPSParameters(params);

    this.getNPSData(paramsArray, (response: any) => {
      if (!response || response.length === 0) {
        return callback(null);
      }
      response.forEach((element, index) => {
        const {
          Year: year,
          ProviderNpsSummary: {
            PhysicianNPSSummary: { PhysicianNPSValue },
            PracticeManagerNPSSummary: { PracticeManagerNPSValue },
            TotalNPSSummary: { TotalNPSValue },
            TargetNPSSummary: {
              CombinedTargetNPSValue = 0,
              PhysicianTargetNPSValue = 0,
              PracticeManagerTargetNPSValue = 0
            }
          },
          CareDelivery,
          Quarter
        } = element;

        let timeFrame = '';
        if (timeFrameText === 'Quarter and Year') {
          timeFrame = 'Q' + Quarter + ' ' + year;
        } else if (timeFrameText === 'Year') {
          timeFrame = year;
        } else if (timeFrameText === 'Quarter vs Quarter') {
          if (index === 0) {
            timeFrame = 'Q' + Quarter + ' ' + year + ' v. ';
          } else {
            timeFrame = result.npsSummary.timeFrame + 'Q' + Quarter + ' ' + year;
          }
        }
        result.npsSummary.timeFrame = timeFrame;

        if (!singleCard) {
          let quarter = '';
          if (quarterFormat === 'Quarter and Year') {
            quarter = 'Q' + Quarter;
          } else {
            if (index === 0) {
              quarter = 'YTD ';
            } else {
              quarter = '';
            }
          }
          result.npsSummary.quarters.push({
            year,
            color: 'color' + (index + 1),
            quarter
          });
        }

        let currentQuarter = false;
        let prevQuarter = true;
        let highlightQuarter = false;
        if (index === 0) {
          currentQuarter = true;
          prevQuarter = false;
          highlightQuarter = true;
        }
        result.npsSummary.all.data.cards.push({
          highlightedValue: parseInt(TotalNPSValue),
          targetValue: parseInt(CombinedTargetNPSValue),
          highlightQuarter,
          currentQuarter,
          prevQuarter,
          captionText: year + ' Target'
        });
        result.npsSummary.pm.data.cards.push({
          highlightedValue: parseInt(PracticeManagerNPSValue),
          currentQuarter,
          prevQuarter,
          targetValue: parseInt(PracticeManagerTargetNPSValue),
          captionText: year + ' Target'
        });
        result.npsSummary.md.data.cards.push({
          highlightedValue: parseInt(PhysicianNPSValue),
          currentQuarter,
          prevQuarter,
          targetValue: parseInt(PhysicianTargetNPSValue),
          captionText: year + ' Target'
        });

        result.careDelivery.data.timeperiod = currentFilter + ' (' + timeFrame + ')';
        result.careDelivery.data.chartData.forEach((chartDataElement: any) => {
          const key = chartDataElement.key;
          const subKey = chartDataElement.subKey;

          if (CareDelivery[key]) {
            const value = parseInt(CareDelivery[key][subKey]);
            if (careDelivery_singleCard) {
              chartDataElement.quarters.push({ title: value + '' + chartDataElement.units });
            } else {
              chartDataElement.report = false;
              chartDataElement.quarters.push({ title: value, currentQuarter, id: index });
            }
          } else {
            if (careDelivery_singleCard) {
              chartDataElement.quarters.push({ title: 0 + ' ' + chartDataElement.units });
            } else {
              chartDataElement.report = false;
              chartDataElement.quarters.push({ title: 0 });
            }
          }
        });
      });
      return callback(result);
    });
  }

  private getNPSParameters(params: NPSParams) {
    const paramsArray: NPSParams[] = [params];
    const { rules } = this.filters.filter((filterItem: any) => filterItem.selected)[0];
    const {
      nps: { dependent }
    } = rules;
    if (dependent) {
      const { key } = dependent;
      const dependentFilter = this.filters.filter((filterItem: any) => filterItem.key === key)[0];
      const dependentParams = dependentFilter.params;
      paramsArray.unshift({ filter: dependentParams });
    }
    return paramsArray;
  }

  private getNPSData(paramsArray: NPSParams[], callback: any) {
    const tasks = [];

    const getNPSDataAsync = (params: any) =>
      new Promise(resolve => {
        this.npsRestService
          .getNPSSummary({ params })
          .subscribe((response: any) => resolve(response), () => resolve(null));
      });
    paramsArray.forEach((paramsItem: any) => {
      tasks.push(getNPSDataAsync(paramsItem));
    });
    Promise.all(tasks).then((response: any) => {
      const totalResponse = [];
      response.forEach((responseItem: any) => {
        if (responseItem) {
          responseItem.forEach((innerResponseItem: any) => {
            totalResponse.push(innerResponseItem);
          });
        }
      });
      callback(totalResponse);
    });
  }
}
