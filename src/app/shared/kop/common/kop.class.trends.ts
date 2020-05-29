export interface TrendData {
  data: string;
  sign: string;
}

export class Trends {
  private value1 = null;
  private value2 = null;
  private result: TrendData;
  constructor({ value1, value2 }) {
    this.value1 = value1;
    this.value2 = value2;
    this.createTrend();
  }
  public createTrend() {
    // If values are not null , then calculate trends
    if (this.value1 !== null && this.value2 !== null) {
      if (this.value1 > this.value2 + 2) {
        this.result = { data: 'Positive Trending', sign: 'up' };
      } else if (this.value1 < this.value2 - 2) {
        this.result = { data: 'Negative Trending', sign: 'down' };
      } else {
        this.result = { data: 'Neutral Trending', sign: 'neutral' };
      }
    }
  }

  public getData() {
    return this.result;
  }
}
