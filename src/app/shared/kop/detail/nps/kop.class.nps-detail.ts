export class NPSDetail {
  public records: any;
  public npsObj = {
    chartId: '',
    title: '',
    MetricID: '35',
    type: 'graph',
    small: false,
    npsGraph: {},
    quarters: []
  };
  constructor({ records, small, id }) {
    this.npsObj.chartId = id;
    this.records = records;
    this.npsObj.small = small;
    this.createGraph();
  }

  public createGraph() {
    this.npsObj.quarters = [
      { highlighted: true, value: 42, year: 2020 },
      { highlighted: false, value: 36, year: 2019 },
      { highlighted: false, value: 36, year: 2018 }
    ];

    const years = [2018, 2019, 2020];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const chartData = [];

    let width = 753;
    if (this.npsObj.small) {
      width = 440;
    }

    let title = '';
    let MetricID = '';
    if (this.npsObj.chartId === 'npsCombined') {
      title = 'Combined NPS';
      MetricID = '35';
      years.forEach((year: any) => {
        quarters.forEach((quarter: any) => {
          const name = quarter;
          // if (name === 'Q1') {
          // name += ' ' + year;
          // }
          chartData.push({
            name: name + year.toString().slice(2),
            year,
            value: Math.floor(60 * Math.random())
          });
        });
      });
    } else if (this.npsObj.chartId === 'npsPM') {
      title = 'Practice Manager NPS';
      MetricID = '36';
      years.forEach((year: any) => {
        chartData.push({
          name: year,
          year,
          value: Math.floor(60 * Math.random())
        });
      });
    } else if (this.npsObj.chartId === 'npsMd') {
      title = 'Physician NPS';
      MetricID = '37';
      years.forEach((year: any) => {
        chartData.push({
          name: year,
          year,
          value: Math.floor(60 * Math.random())
        });
      });
    }

    this.npsObj.title = title;
    this.npsObj.MetricID = MetricID;

    const npsGraph = {
      chartId: this.npsObj.chartId,
      titleData: [{}],
      chartData,
      generalData2: [],
      chartData2: [],
      generalData: [
        {
          width,
          height: 260,
          backgroundColor: 'null',
          barGraphNumberSize: 18,
          barColor: '#196ECF',
          parentDiv: this.npsObj.chartId,
          tooltipBoolean: true,
          tooltipType: 'nps',
          hideYAxis: false,
          customTextClass: true,
          yAxisUnits: ''
        }
      ]
    };

    this.npsObj.npsGraph = npsGraph;

    // this.monthlyLineGraph = {
    //   category: 'large-card',
    //   type: 'donut',
    //   status: 404,
    //   title: 'Claims Non-Payment Trend',
    //   MetricID: this.MetricidService.MetricIDs.ClaimsNonPaymentTrend,
    //   data: null,
    //   timeperiod: null
    // };
  }

  public getData() {
    return this.npsObj;
  }
}
