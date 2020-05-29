export class CallsChartData {
  public chartData: any[] = [];
  public generalData: any[] = [];
  public lineTitle: string;
  public value: number;
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
  public chartId: string;
  public titleData: any[] = [{}];
  public lineOne: CallsChartData;
  public lineTwo: CallsChartData;
  public lineThree: CallsChartData;
  public lineFour: CallsChartData;

  constructor(data: any, generalData, title) {
    this.chartId = title;
    this.lineOne = new CallsChartData(data['B&E'], generalData['B&E'], 'B&E');
    this.lineTwo = new CallsChartData(data['CLAIMS'], generalData['CLAIMS'], 'CLAIMS');
    this.lineThree = new CallsChartData(data['P&A'], generalData['P&A'], 'P&A');
    this.lineFour = new CallsChartData(data['Other'], generalData['Other'], 'Other');
  }
}
