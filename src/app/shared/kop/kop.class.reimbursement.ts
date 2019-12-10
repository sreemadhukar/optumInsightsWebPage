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
      const { ReimbursementClaims: Reimbursement_Data = {} } = record;

      // For Claims Processing Accuracy %
      // const { Reimbursement: Reimbursement_Data = {} } = record;

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
            chartDataElement.quarters.push({ title: this.nFormatter(value) + '' + chartDataElement.units });
          } else {
            chartDataElement.report = false;
            chartDataElement.quarters.push({
              title: value,
              currentQuarter: true,
              id: index,
              section: this.section,
              units: chartDataElement.units
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
        key: 'ClaimsTAT',
        subKey: 'ClaimsTATValue',
        units: ' days',
        caption: 'Avg. turnaround time',
        singleCard: this.singleCard,
        report: false,
        color: ['#3381FF', '#80B0FF'],
        sdata: {
          sign: 'up',
          data: 'Positive Trending'
        },
        metricType: 'reimbursementClaims'
      },
      {
        quarters: [],
        cardType: 'verticalBar',
        key: 'ClaimsSubmitted',
        subKey: 'ClaimsSubmittedValue',
        units: '',
        singleCard: this.singleCard,
        caption: 'Total Claims Submitted',
        report: false,
        color: ['#3381FF', '#80B0FF'],
        sdata: {
          sign: 'up',
          data: 'Positive Trending'
        },
        metricType: 'reimbursementClaims'
      },
      {
        quarters: [],
        cardType: 'verticalBar',
        key: 'ClaimsPaid',
        subKey: 'ClaimsPaidValue',
        singleCard: this.singleCard,
        units: '',
        report: true,
        caption: 'Total Paid',
        sdata: {
          sign: 'up',
          data: 'Positive Trending'
        },
        metricType: 'reimbursementClaims'
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
        },
        metricType: 'kop'
      }
    ];
    this.data.chartData = chartData;
  }

  public getData() {
    return this.data;
  }

  public nFormatter(fnumber) {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (fnumber < 1000) {
      return parseFloat(fnumber)
        .toFixed(1)
        .replace(/\.0$/, '');
    }
    return fnumber;
  }
}
