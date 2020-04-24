import { Trends } from './common/kop.class.trends';

export class NetworkParticipation {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Onboarding',
    chartData: [],
    type: 'cards',
    MetricID: '54,55',
    quarters: []
  };
  private section = 'networkparticipation';
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
      const { NetworkParticipation: Network_Participation = {} } = record;
      this.data.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;
        if (!Network_Participation || !Network_Participation[key]) {
          chartDataElement.report = false;
          chartDataElement.quarters.push({
            title: null,
            currentQuarter: true,
            id: index,
            section: this.section + key
          });
        } else {
          const value =
            Network_Participation[key][subKey] !== null ? Math.round(Network_Participation[key][subKey]) : null;
          if (this.singleCard && value !== null) {
            chartDataElement.quarters.push({ title: value + '' + chartDataElement.units });
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({
              title: value,
              value,
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
        trends: false
      },
      {
        quarters: [],
        cardType: 'verticalBar',
        key: 'PriorAuthRequested',
        subKey: 'PriorAuthRequestedValue',
        units: 'K',
        singleCard: this.singleCard,
        caption: 'Providers onboarded',
        report: false,
        color: ['#3381FF', '#80B0FF'],
        trends: false
      },
      {
        quarters: [],
        cardType: 'hollowbox',
        key: 'SatWithCredentialing',
        subKey: 'SatWithCredentialingValue',
        singleCard: this.singleCard,
        units: '%',
        report: true,
        caption: 'SAT with credentialing process',
        trends: true
      },
      {
        quarters: [],
        cardType: 'miniDonut',
        key: 'EaseOfCredentialing',
        subKey: 'EaseOfCredentialingValue',
        singleCard: this.singleCard,
        graphValues: [],
        units: '%',
        report: true,
        caption: 'Ease of Credentialing',
        color: ['#3381FF', '#E0E0E0'],
        trends: false
      }
    ];
    this.data.chartData = chartData;
  }

  public getData() {
    return this.data;
  }
}
