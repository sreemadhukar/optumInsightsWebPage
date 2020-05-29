export class TimePeriod {
  public singleCard = false;
  public timeFrameFormat: any;
  public quarterFormat: any;
  public records: any;
  public timePeriod = {
    title: '',
    timeFrame: {},
    quarters: []
  };
  constructor({ records, quarterFormat, title, timeFrameFormat }) {
    this.records = records;
    this.timePeriod.title = title;
    this.quarterFormat = quarterFormat;
    this.timeFrameFormat = timeFrameFormat;
    this.singleCard = records.length === 1 ? true : false;
    if (!this.singleCard) {
      this.createQuarterCard();
    }
    this.generateTimeframe();
  }

  generateTimeframe() {
    const quarters = [];
    const years = [];
    this.records.forEach(record => {
      const { Year, Quarter } = record;
      quarters.push(Quarter);
      years.push(Year);
    });
    this.timePeriod.timeFrame = { quarters, format: this.timeFrameFormat, years };
  }

  public createQuarterCard() {
    this.records.forEach((dataItem, index) => {
      const { Year, Quarter } = dataItem;
      this.timePeriod.quarters.push({
        year: Year,
        index,
        format: this.quarterFormat,
        color: 'color' + (index + 1),
        quarter: Quarter
      });
    });
  }
  public getData() {
    return this.timePeriod;
  }
}
