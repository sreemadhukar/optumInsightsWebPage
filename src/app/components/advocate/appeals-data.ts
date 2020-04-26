export class AppealsChartData {
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

export class AppealsData {
  public chartId: string;
  public titleData: any[] = [{}];
  public lineOne: AppealsChartData;
  public lineTwo: AppealsChartData;
  public lineThree: AppealsChartData;
  public lineFour: AppealsChartData;

  constructor(data: any, generalData, title) {
    this.chartId = title;
    this.lineOne = new AppealsChartData(data['M&R'], generalData['M&R'], 'M&R');
    this.lineTwo = new AppealsChartData(data['C&S'], generalData['C&S'], 'C&S');
    this.lineThree = new AppealsChartData(data['E&I'], generalData['E&I'], 'E&I');
    this.lineFour = new AppealsChartData(data['Others'], generalData['Others'], 'Others');
  }
}
