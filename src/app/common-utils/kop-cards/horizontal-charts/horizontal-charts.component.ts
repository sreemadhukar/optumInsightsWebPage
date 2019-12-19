import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-charts',
  templateUrl: './horizontal-charts.component.html',
  styleUrls: ['./horizontal-charts.component.scss']
})
export class HorizontalChartsComponent implements OnInit {
  @Input() data: any;

  public widths: string[] = ['0%', '0%'];
  public get barChartData() {
    return this.data;
  }
  constructor() {}

  ngOnInit() {
    const divisionValue = 50;
    const [{ title: value1 }, { title: value2 }] = this.data;
    if (value1 < value2) {
      this.widths[1] = divisionValue + '%';
      this.widths[0] = (value1 / value2) * divisionValue + '%';
    } else {
      this.widths[1] = (value2 / value1) * divisionValue + '%';
      this.widths[0] = divisionValue + '%';
    }
  }
}
