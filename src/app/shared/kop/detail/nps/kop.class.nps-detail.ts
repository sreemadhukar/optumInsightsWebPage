export class NPSDetail {
  public records: any;
  public npsObj = {
    title: 'Combined NPS',
    MetricID: '35',
    type: 'graph',
    small: false,
    npsGraph: {},
    quarters: []
  };
  constructor({ records, small }) {
    this.records = records;
    this.npsObj.small = small;
    this.createGraph();
  }

  public createGraph() {
    this.npsObj.quarters = [
      { highlighted: true, value: 42, year: 2019 },
      { highlighted: false, value: 36, year: 2018 },
      { highlighted: false, value: 36, year: 2017 }
    ];

    const years = [2017, 2018, 2019];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const chartData = [];

    years.forEach((year: any) => {
      quarters.forEach((quarter: any) => {
        let name = quarter;
        if (name === 'Q1') {
          name += ' ' + year;
        }
        chartData.push({
          name,
          year,
          value: 10
        });
      });
    });

    const npsGraph = {
      chartId: 'non-payment-trend-block',
      titleData: [{}],
      chartData,
      generalData2: [],
      chartData2: [],
      generalData: [
        {
          width: 692,
          backgroundColor: 'null',
          barGraphNumberSize: 18,
          barColor: '#196ECF',
          parentDiv: 'non-payment-trend-block',
          tooltipBoolean: true,
          hideYAxis: false,
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
