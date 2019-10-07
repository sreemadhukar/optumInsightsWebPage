export class CareDelivery {
  public singleCard = false;
  public records: any;
  public careDelivery = {
    title: 'Care Delivery',
    chartData: [],
    quarters: []
  };
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createSchema();
    this.createCard();
  }

  public createCard() {
    this.records.forEach((record, index) => {
      const { CareDelivery: Care_Delivery } = record;
      this.careDelivery.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;

        if (Care_Delivery[key]) {
          const value = Math.round(Care_Delivery[key][subKey]);
          if (this.singleCard) {
            chartDataElement.quarters.push({ title: value + '' + chartDataElement.units });
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({ title: value, currentQuarter: true, id: index });
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
        caption: 'Avg. Prior Auth turnaround time',
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
        key: 'EaseOfMedicalAuth',
        subKey: 'EaseOfMedicalAuthValue',
        singleCard: this.singleCard,
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
    ];
    this.careDelivery.chartData = chartData;
  }

  public getData() {
    return this.careDelivery;
  }
}
