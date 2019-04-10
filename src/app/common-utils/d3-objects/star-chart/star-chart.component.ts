import { Component, OnInit, Input, ViewEncapsulation, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-star-chart',
  templateUrl: './star-chart.component.html',
  styleUrls: ['./star-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class StarChartComponent implements OnInit, AfterViewInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doStarComponent(this.chartOptions);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doStarComponent(this.chartOptions);
  }

  doStarComponent(chartOptions: any) {
    const preWidth = document.getElementsByClassName(chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 0, bottom: 10, left: 0 },
      width = preWidth - margin.left - margin.right,
      height = preWidth - margin.top - margin.bottom;

    const svg = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg
      .append('svg:image')
      .attr('x', (width + margin.left + margin.right) / 3.5)
      .attr('y', 0)
      .attr('width', width / 2.5)
      .attr('height', width / 2.5)
      .attr('xlink:href', 'src/assets/images/star.png');

    svg
      .append('text')
      .attr('x', (width + margin.left + margin.right - 10) / 2)
      .attr('y', 75)
      .attr('font-family', 'UHCSans-Regular')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '22')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text(chartOptions.centerNumber);
  }
}
