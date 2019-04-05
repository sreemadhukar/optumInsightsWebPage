import { Component, OnInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  public sampleDonut: any = {};
  public sampleStar: any = {};
  constructor(private overviewsrc: OverviewSharedService) {}

  ngOnInit() {
    this.overviewsrc.getOverviewData();

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

    this.sampleStar.chartId = 'sampleStarChart';
    this.sampleStar.chartData = [{ name: 'Commercial', number: 5 }];
    this.sampleStar.generalData = [
      {
        parentDiv: 'sampleStarChart'
      }
    ];
  }
}
