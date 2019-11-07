export class IssueResolution {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Issue Resolution',
    chartData: [],
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
            section: this.section
          });
        } else {
          const value = Issue_Resolution[key][subKey] ? Math.round(Issue_Resolution[key][subKey]) : null;
          if (this.singleCard && value !== null) {
            chartDataElement.quarters.push({ title: value + '' + chartDataElement.units });
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({
              title: value,
              currentQuarter: true,
              id: index,
              section: this.section
            });
          }
        }
      });
    });
  }

  public createSchema() {
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
          data: 'Positive Trending'
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
          data: 'Positive Trending'
        }
      },
      {
        quarters: [],
        cardType: 'hollowbox',
        key: 'LinkPriorAuthNPS',
        subKey: 'LinkPriorAuthNPSValue',
        singleCard: this.singleCard,
        units: '%',
        report: true,
        caption: 'SAT with credentialing process',
        sdata: {
          sign: 'up',
          data: 'Positive Trending'
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
          data: 'Positive Trending'
        }
      }
    ];
    this.data.chartData = chartData;
  }

  public getData() {
    return this.data;
  }
}
