export class IssueResolution {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Issue Resolution',
    chartData: [],
    type: 'cards',
    MetricID: '202,51',
    quarters: []
  };
  private section = 'issueresolution';
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createSchema();
    this.createCard();
  }

  public createCard() {
    this.records.forEach((record, index) => {
      const { IssueResolution: Issue_Resolution = {} } = record;
      this.data.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;
        if (!Issue_Resolution[key]) {
          chartDataElement.report = false;
          chartDataElement.quarters.push({
            title: null,
            currentQuarter: true,
            id: index,
            section: this.section + key
          });
        } else {
          const value = Issue_Resolution[key][subKey] !== null ? Math.round(Issue_Resolution[key][subKey]) : null;
          if (this.singleCard && value !== null) {
            chartDataElement.quarters.push({ title: value + '' + chartDataElement.units });
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({
              title: value,
              currentQuarter: true,
              id: index,
              section: this.section + key
            });
          }
        }
      });
    });
  }

  public createSchema() {
    const sDataText = 'Positive Trending';
    const chartData = [
      {
        quarters: [],
        cardType: 'horizontalBar',
        key: 'PriorAuthTurnTime',
        subKey: 'PriorAuthTurnTimeValue',
        units: 'hours',
        caption: 'Total Calls',
        singleCard: this.singleCard,
        report: false,
        color: ['#3381FF', '#80B0FF'],
        sdata: {
          sign: 'up',
          data: sDataText
        }
      },
      {
        quarters: [],
        cardType: 'verticalBar',
        key: 'PriorAuthRequested',
        subKey: 'PriorAuthRequestedValue',
        units: 'K',
        singleCard: this.singleCard,
        caption: 'Resolved on first call',
        report: false,
        color: ['#3381FF', '#80B0FF'],
        sdata: {
          sign: 'up',
          data: sDataText
        }
      },
      {
        quarters: [],
        cardType: 'miniDonut',
        key: 'AbilityToResolveIssues',
        subKey: 'AbilityToResolveIssuesValue',
        singleCard: this.singleCard,
        units: '',
        report: true,
        caption: 'Ability to resolve issues',
        sdata: {
          sign: 'up',
          data: sDataText
        }
      },
      {
        quarters: [],
        cardType: 'miniDonut',
        key: 'OverallSATWithService',
        subKey: 'OverallSATWithServiceValue',
        singleCard: this.singleCard,
        graphValues: [],
        units: '%',
        report: true,
        caption: 'Overall satisfaction with service',
        color: ['#3381FF', '#E0E0E0'],
        sdata: {
          sign: 'up',
          data: sDataText
        }
      }
    ];
    this.data.chartData = chartData;
  }

  public getData() {
    return this.data;
  }
}
