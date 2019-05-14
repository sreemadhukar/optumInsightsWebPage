import { Component, OnInit, Input, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-mini-bar-chart',
  templateUrl: './mini-bar-chart.component.html',
  styleUrls: ['./mini-bar-chart.component.scss']
})
export class MiniBarChartComponent implements OnInit, AfterViewInit {
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() numberData: any = {};
  public transition = 1;
  public noTransition = 0;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doMiniBarChart(this.chartOptions, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doMiniBarChart(this.chartOptions, this.transition);
  }

  doMiniBarChart(chartOptions: any, transition: number) {
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 0, bottom: 10, left: 0 };
    const width = preWidth - margin.left - margin.right;
    const height = 50 - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + 10 + ',' + 0 + ')');

    let totalSum = 0;

    for (let i = 0; i < chartOptions.graphValues.length; i++) {
      totalSum = totalSum + parseNumber(chartOptions.graphValues[i]);
    }
    console.log('sum-mini', totalSum);
    const xScale = d3
      .scaleLinear()
      .domain([0, totalSum])
      .range([0, 178]);

    chart
      .append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', xScale(chartOptions.graphValues[0]))
      .attr('height', 20)
      .attr('fill', chartOptions.color[0]);

    chart
      .append('rect')
      .attr('x', 10 + xScale(chartOptions.graphValues[0]))
      .attr('y', 10)
      .attr('width', 2)
      .attr('height', 20)
      .attr('fill', chartOptions.color[1]);

    chart
      .append('rect')
      .attr('x', 12 + xScale(chartOptions.graphValues[0]))
      .attr('y', 10)
      .attr('width', xScale(chartOptions.graphValues[1]) + 1)
      .attr('height', 20)
      .attr('fill', chartOptions.color[2]);
  }
}
