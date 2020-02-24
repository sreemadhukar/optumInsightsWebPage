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

  public getRandomInterger(max: number, min: number) {
    return Math.floor((max - min) * Math.random()) + min;
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
    let trendLine = false;
    if (this.npsObj.chartId === 'npsCombined') {
      title = 'Combined NPS';
      MetricID = '35';
      trendLine = true;
      let target = 5;
      years.forEach((year: any) => {
        quarters.forEach((quarter: any) => {
          const name = quarter;
          // if (name === 'Q1') {
          // name += ' ' + year;
          // }
          chartData.push({
            name: name + year.toString().slice(2),
            year,
            target,
            value: this.getRandomInterger(60, 30)
          });
        });
        target += 10;
      });
    } else if (this.npsObj.chartId === 'npsPM') {
      title = 'Practice Manager NPS';
      MetricID = '36';
      trendLine = false;
      let target = 5;

      years.forEach((year: any) => {
        chartData.push({
          name: year,
          target,
          year,
          value: this.getRandomInterger(60, 30)
        });
        target += 10;
      });
    } else if (this.npsObj.chartId === 'npsMd') {
      title = 'Physician NPS';
      MetricID = '37';
      trendLine = false;
      let target = 5;

      years.forEach((year: any) => {
        chartData.push({
          name: year,
          target,
          year,
          value: this.getRandomInterger(60, 30)
        });
        target += 10;
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
          hoverMargin: 256,
          backgroundColor: 'null',
          barGraphNumberSize: 18,
          barColor: '#196ECF',
          trendLineColor: '#00B8CC',
          trendLine,
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
