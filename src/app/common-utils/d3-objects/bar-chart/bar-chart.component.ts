import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.less']
})
export class BarChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doBarChart(this.chartOptions, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doBarChart(this.chartOptions, this.transition);
  }

  doBarChart(chartOptions: any, transition: number) {
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let barHeight = 48;
    if (chartOptions.barHeight) {
      barHeight = chartOptions.barHeight;
    }

    const margin = { top: 20, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = barHeight * 2 - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xScale = d3
      .scaleLinear()
      .domain([0, chartOptions.barSummation])
      .range([0, width]);

    chart
      .append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', xScale(chartOptions.barData))
      .attr('height', barHeight)
      .attr('fill', chartOptions.color[0].color1);

    if (chartOptions.color[1].color2) {
      chart
        .append('rect')
        .attr('x', xScale(chartOptions.barData))
        .attr('y', 10)
        .attr('width', xScale(chartOptions.barSummation) - xScale(chartOptions.barData))
        .attr('height', barHeight)
        .attr('fill', chartOptions.color[1].color2);
    }
  }
}
