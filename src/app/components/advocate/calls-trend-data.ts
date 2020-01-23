export class CallsChartData {
  private chartData: any[] = [];
  private generalData: any[] = [];
  private lineTitle: string;
  private value: number;
  constructor(chartData, generalData, title) {
    if (chartData) {
      this.chartData = chartData;
      this.generalData = generalData;
      this.lineTitle = title;
      this.value = this.sum('value', chartData);
    }
  }

  sum(key, array) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }
}

export class CallsTrendData {
  private chartId: string;
  private titleData: any[] = [{}];
  private lineOne: CallsChartData;
  private lineTwo: CallsChartData;
  private lineThree: CallsChartData;
  private lineFour: CallsChartData;

  constructor(data: any, generalData, title) {
    this.chartId = title;
    this.lineOne = new CallsChartData(data['B&E'], generalData['B&E'], 'B&E');
    this.lineTwo = new CallsChartData(data['CLAIMS'], generalData['CLAIMS'], 'CLAIMS');
    this.lineThree = new CallsChartData(data['P&A'], generalData['P&A'], 'P&A');
    this.lineFour = new CallsChartData(data['Other'], generalData['Other'], 'Other');
  }
}
