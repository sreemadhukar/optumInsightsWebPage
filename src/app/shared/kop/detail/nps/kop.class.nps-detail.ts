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
  public keys;

  constructor({ records, small, id }) {
    this.npsObj.chartId = id;
    this.records = records;
    this.npsObj.small = small;
    this.keys = {
      npsSummaryKey: 'ProviderNpsSummary',
      npsCombined: {
        currentKey: 'TotalNPSSummary',
        currentValueKey: 'TotalNPSValue',
        currentTargetKey: 'TargetNPSSummary',
        currentTargetValueKey: 'CombinedTargetNPSValue'
      }
    };
    this.createGraph();
  }

  public sortRecords(key: string) {
    return (a: any, b: any) => {
      return b[key] - a[key];
    };
  }

  public getRandomInteger(max: number, min: number) {
    return Math.floor((max - min) * Math.random()) + min;
  }

  public getNpsValue(data: any, type: string) {
    try {
      if (type === 'totalCurrentValue') {
        return (
          data[this.keys.npsSummaryKey][this.keys[this.npsObj.chartId].currentKey][
            this.keys[this.npsObj.chartId].currentValueKey
          ] || 0
        );
      }

      if (type === 'targetValue') {
        return (
          data[this.keys.npsSummaryKey][this.keys[this.npsObj.chartId].currentTargetKey][
            this.keys[this.npsObj.chartId].currentTargetValueKey
          ] || 0
        );
      }

      if (type === 'currentValue') {
        return (
          data[this.keys.npsSummaryKey][this.keys[this.npsObj.chartId].currentKey][
            this.keys[this.npsObj.chartId].currentValueKey
          ] || 0
        );
      }
    } catch (err) {
      return 0;
    }
  }

  public createGraph() {
    const yearLevelRecords = this.records.filter((record: any) => {
      return record.Quarter === '1,2,3,4';
    });

    yearLevelRecords.forEach((yearLevelRecord: any, index: any) => {
      const highlighted = yearLevelRecords.length === index + 1 ? true : false;
      this.npsObj.quarters.push({
        year: parseInt(yearLevelRecord.Year),
        highlighted,
        value: Math.round(this.getNpsValue(yearLevelRecord, 'totalCurrentValue'))
      });
    });

    this.npsObj.quarters = this.npsObj.quarters.sort(this.sortRecords('year'));

    const years = this.npsObj.quarters.map((quarter: any) => quarter.year);

    const quarterLevelRecords = this.records
      .filter((record: any) => {
        const year = parseInt(record.Year);
        return record.Quarter !== '1,2,3,4' && years.includes(year);
      })
      .sort(this.sortRecords('year'));

    const chartData = [];
    const dupDelimiter = 'dupDelm';

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

      quarterLevelRecords.forEach((quarterLevelRecord: any) => {
        const yearString = quarterLevelRecord.Year;
        const year = parseInt(quarterLevelRecord.Year);
        let name = 'Q' + quarterLevelRecord.Quarter;
        if (name === 'Q1') {
          name += '_' + yearString;
        }
        chartData.push({
          name: name + yearString.slice(2) + dupDelimiter,
          year,
          quarter: 'Q' + quarterLevelRecord.Quarter,
          target: Math.round(this.getNpsValue(quarterLevelRecord, 'targetValue')),
          value: Math.round(this.getNpsValue(quarterLevelRecord, 'currentValue'))
        });
      });
    } else if (this.npsObj.chartId === 'npsPM') {
      title = 'Practice Manager NPS';
      MetricID = '36';
      trendLine = false;
    } else if (this.npsObj.chartId === 'npsMd') {
      title = 'Physician NPS';
      MetricID = '37';
      trendLine = false;
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
          barColor: '#3381ff',
          trendLineColor: '#00B8CC',
          trendLine,
          parentDiv: this.npsObj.chartId,
          tooltipBoolean: true,
          tooltipType: 'nps',
          hideYAxis: false,
          customTextClass: true,
          yAxisUnits: '',
          dupDelimiter,
          formattedXAxis: true
        }
      ]
    };

    this.npsObj.npsGraph = npsGraph;
  }

  public getData() {
    return this.npsObj;
  }
}
