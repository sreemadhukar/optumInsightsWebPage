import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  public sampleDonut: any = {};
  constructor() {}

  ngOnInit() {
    this.sampleDonut.chartId = 'sampleDonutChart';
    this.sampleDonut.chartData = [
      { name: 'Commercial', value: 5 },
      { name: 'Medicaid', value: 5 },
      { name: 'Medicare', value: 5 }
    ];
    this.sampleDonut.generalData = [
      {
        parentDiv: 'sampleDonutChart',
        color1: 'blue',
        color2: 'green',
        color3: 'red',
        type: 'arc-padding',
        amount: '$1500'
      }
    ];
  }
}
