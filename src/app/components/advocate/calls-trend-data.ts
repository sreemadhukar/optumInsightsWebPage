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
    this.lineOne = new CallsChartData(data['M&R'], generalData['M&R'], 'M&R');
    this.lineTwo = new CallsChartData(data['C&S'], generalData['C&S'], 'C&S');
    this.lineThree = new CallsChartData(data['E&I'], generalData['E&I'], 'E&I');
    this.lineFour = new CallsChartData(data['Others'], generalData['Others'], 'Others');
  }
}
