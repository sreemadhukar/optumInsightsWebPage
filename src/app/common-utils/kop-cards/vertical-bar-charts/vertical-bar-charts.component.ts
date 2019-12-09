import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vertical-bar-charts',
  templateUrl: './vertical-bar-charts.component.html',
  styleUrls: ['./vertical-bar-charts.component.scss']
})
export class VerticalBarChartsComponent implements OnInit {
  @Input() data: any;

  public heights: string[] = ['0%', '0%'];
  public get barChartData() {
    return this.data;
  }
  constructor() {}

  ngOnInit() {
    const divisionValue = 85;
    const [{ title: value1 }, { title: value2 }] = this.data;
    if (value1 < value2) {
      this.heights[1] = divisionValue + '%';
      this.heights[0] = (value1 / value2) * divisionValue + '%';
    } else {
      this.heights[1] = (value2 / value1) * divisionValue + '%';
      this.heights[0] = divisionValue + '%';
    }
  }
}
