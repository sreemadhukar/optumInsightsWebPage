export class NetworkParticipation {
  public singleCard = false;
  public records: any;
  public data = {
    title: 'Network Participation',
    chartData: [],
    quarters: []
  };
  private section = 'networkparticipation';
  constructor({ records }) {
    this.records = records;
    this.singleCard = records.length === 1 ? true : false;
    this.createSchema();
    this.createCard();
  }

  public createCard() {
    this.records.forEach((record, index) => {
      const Network_Participation = record;
      this.data.chartData.forEach((chartDataElement: any) => {
        const key = chartDataElement.key;
        const subKey = chartDataElement.subKey;
        if (!Network_Participation[key]) {
          chartDataElement.report = false;
          chartDataElement.quarters.push({
            title: null,
            currentQuarter: true,
            id: index,
            section: this.section
          });
        }

        if (Network_Participation[key]) {
          const value = Network_Participation[key][subKey] ? Math.round(Network_Participation[key][subKey]) : null;
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
        caption: 'Providers onboarded',
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
        key: 'EaseOfCredentialing',
        subKey: 'EaseOfCredentialingValue',
        singleCard: this.singleCard,
        graphValues: [],
        units: '%',
        report: true,
        caption: 'Ease of Credentialing',
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
