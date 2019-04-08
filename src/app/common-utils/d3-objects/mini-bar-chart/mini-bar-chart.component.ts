import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-mini-bar-chart',
  templateUrl: './mini-bar-chart.component.html',
  styleUrls: ['./mini-bar-chart.component.scss']
})
export class MiniBarChartComponent implements OnInit {
  public renderChart: string;
  @Input() chartOptions: any = {};
  public transition = 1;
  public noTransition = 0;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doMiniBarChart(this.chartOptions.chartData, this.chartOptions.generalData, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.chartId;
    this.doMiniBarChart(this.chartOptions.chartData, this.chartOptions.generalData, this.transition);
  }

  doMiniBarChart(chartData: any, generalData: any, transition: number) {
    const preWidth = document.getElementById(generalData[0].parentDiv).clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;
  }
}
