export class Reimbursement {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Reimbursement',
    chartData: [],
    quarters: []
  };
  private section = 'reimbursement';
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createSchema();
    this.createCard();
  }

  public createCard() {
    this.records.forEach((record, index) => {
      const { Reimbursement: Reimbursement_Data = {} } = record;
      this.data.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;

        if (!Reimbursement_Data[key]) {
          chartDataElement.report = false;
          chartDataElement.quarters.push({
            title: null,
            currentQuarter: true,
            id: index,
            section: this.section
          });
        } else {
          const value = Reimbursement_Data[key][subKey] ? Math.round(Reimbursement_Data[key][subKey]) : null;
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
        caption: 'Avg. turnaround time',
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
        singleCard: this.singleCard,
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
        key: 'ClaimsProcessAccuracy',
        subKey: 'ClaimsProcessAccuracyValue',
        singleCard: this.singleCard,
        graphValues: [],
        units: '%',
        report: true,
        caption: 'Claims processing accuracy',
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
