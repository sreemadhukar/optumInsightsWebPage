import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-simple-pi',
  templateUrl: './bar-simple-pi.component.html',
  styleUrls: ['./bar-simple-pi.component.scss']
})
export class BarSimplePiComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.id;
  }
  ngAfterViewInit() {
    this.doBarChart(this.chartOptions, this.transition);
  }

  doBarChart(chartOptions: any, _transition: number) {
    // const preWidth = document.getElementsByClassName('top-5-block')[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let xScaleMax = chartOptions.barSum;

    let barHeight = 22;
    let heightAdjustor = 48;
    if (chartOptions.maxValue) {
      barHeight = 50;
      xScaleMax = chartOptions.maxValue;
      heightAdjustor = 32;
    }

    const margin = { top: 25, right: 10, bottom: 5, left: 10 };
    const width = 342 - margin.left - margin.right;
    const height = heightAdjustor * 1.5 - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    const xScale = d3
      .scaleLinear()
      .domain([0, xScaleMax])
      .range([0, 340]);

    let blueBarLength;
    if (chartOptions.maxValue) {
      blueBarLength = xScale(chartOptions.numeric);
    }

    chart
      .append('rect')
      .attr('x', 0)
      .attr('y', 5)
      .attr('width', blueBarLength)
      .attr('height', barHeight)
      .attr('fill', chartOptions.color);
  }
}
