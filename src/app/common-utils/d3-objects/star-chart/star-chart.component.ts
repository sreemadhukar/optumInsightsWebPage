import { Component, OnInit, Input, ViewEncapsulation, HostListener } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-star-chart',
  templateUrl: './star-chart.component.html',
  styleUrls: ['./star-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class StarChartComponent implements OnInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.chartId;
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }

  onSystemChange() {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }

  doStarComponent(chartData: any, generalData: any) {
    const preWidth = document.getElementById(generalData[0].parentDiv).clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = preWidth - margin.left - margin.right,
      height = preWidth - margin.top - margin.bottom;

    const svg = d3
      .select(this.renderChart)
      .selectAll('svg')
      .data(chartData)
      .enter()
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg
      .append('svg:image')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 160)
      .attr('height', 168)
      .attr('xlink:href', 'assets/images/star.png');

    svg
      .append('text')
      .attr('x', 100)
      .attr('y', 123)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '36')
      .attr('text-anchor', 'middle')
      .text(chartData[0].number);
  }
}
