import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
@Component({
  selector: 'app-color-grey-mini-bar-chart',
  templateUrl: './color-grey-mini-bar-chart.component.html',
  styleUrls: ['./color-grey-mini-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorGreyMiniBarChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  printStyle: boolean;
  @Input() chartOptions: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.id;
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }
  ngAfterViewInit() {
    this.doBarChart(this.chartOptions, this.transition);
  }

  doBarChart(chartOptions: any, transition: number) {
    // const preWidth = document.getElementsByClassName('top-5-block')[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let xScaleMax = chartOptions.barSum;

    let barHeight = 22;
    let heightAdjustor = 48;
    let marginTopAdjustor = 0;
    if (chartOptions.maxValue) {
      barHeight = 48;
      xScaleMax = chartOptions.maxValue;
      heightAdjustor = 32;
      marginTopAdjustor = -32;
    }

    const margin = { top: 25, right: 10, bottom: 5, left: 10 };
    const width = 500 - margin.left - margin.right;
    const height = heightAdjustor * 1.5 - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + (margin.left + 6) + ',' + (margin.top + marginTopAdjustor) + ')');

    const xScale = d3
      .scaleLinear()
      .domain([0, xScaleMax])
      .range([0, 510]);

    let blueBarLength;
    if (chartOptions.maxValue) {
      blueBarLength = xScale(chartOptions.numeric);
    } else {
      blueBarLength = xScale(chartOptions.valueNumeric);
    }

    chart
      .append('rect')
      .attr('x', 20)
      .attr('y', 5)
      .attr('width', blueBarLength)
      .attr('height', barHeight)
      .attr('fill', '#3381ff');

    // 517 * 48

    if (chartOptions.barSum) {
      chart
        .append('rect')
        .attr('x', 20 + blueBarLength)
        .attr('y', 5)
        .attr('width', xScale(chartOptions.barSum) - blueBarLength)
        .attr('height', barHeight)
        .attr('fill', '#cdcdcd');
    }
  }
}
