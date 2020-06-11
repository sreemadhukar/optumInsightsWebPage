import { Trends } from './common/kop.class.trends';

export class CareDelivery {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Care Delivery',
    MetricID: '43,44',
    type: 'cards',
    chartData: [],
    quarters: []
  };
  private section = 'caredelivery';
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createSchema();
    this.createCard();
    if (!this.singleCard) {
      this.createTrend();
    }
  }
  public createTrend() {
    this.data.chartData.forEach((dataItem: any) => {
      const { quarters, trends } = dataItem;
      const [{ value: value1 }, { value: value2 }] = quarters;
      if (trends) {
        const trendsData = new Trends({ value1, value2 });
        dataItem.sdata = trendsData.getData();
      }
    });
  }

  public createCard() {
    this.records.forEach((record, index) => {
      const { CareDelivery: Care_Delivery = {} } = record;
      this.data.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;
        if (!Care_Delivery[key]) {
          chartDataElement.report = false;
          chartDataElement.quarters.push({
            title: null,
            value: null,
            currentQuarter: true,
            id: index,
            section: this.section
          });
        } else {
          const value = Care_Delivery[key][subKey] !== null ? Math.round(Care_Delivery[key][subKey]) : null;
          if (this.singleCard && value !== null) {
            if (chartDataElement.units === 'K') {
              chartDataElement.quarters.push({ title: value });
            } else {
              chartDataElement.quarters.push({
                title: value === 1 ? value + ' day' : value + '' + chartDataElement.units
              });
            }
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({
              title: value,
              value: value || 0,
              currentQuarter: true,
              id: index,
              units: value === 1 ? 'day' : chartDataElement.units,
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
        key: 'PriorAuthTAT',
        subKey: 'PriorAuthTATValue',
        units: ' days',
        caption: 'Avg. Prior Auth turnaround time',
        singleCard: this.singleCard,
        report: false,
        color: ['#3381FF', '#80B0FF'],
        trends: false,
        metricType: 'priorauthtat'
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
        trends: false,
        color: ['#3381FF', '#80B0FF'],
        metricType: 'priorauthtat'
      },
      {
        quarters: [],
        cardType: 'hollowbox',
        key: 'LinkPriorAuthNPS',
        subKey: 'LinkPriorAuthNPSValue',
        singleCard: this.singleCard,
        units: '',
        report: true,
        trends: true,
        caption: 'Link Prior Auth NPS',
        metricType: 'kop'
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
        trends: false,
        color: ['#3381FF', '#E0E0E0'],
        metricType: 'kop'
      }
    ];
    this.data.chartData = chartData;
  }

  public getData() {
    return this.data;
  }
}
