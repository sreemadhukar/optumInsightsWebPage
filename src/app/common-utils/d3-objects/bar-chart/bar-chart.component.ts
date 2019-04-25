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

    const margin = { top: 25, right: 10, bottom: 5, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = barHeight * 1.5 - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    /*
    const div = d3.select(this.renderChart).append('div')
      .attr('class', 'tooltip')
      .style('height', 200)
      .style('opacity', 0)
      .style('border-radius', 0)

    const svg2 = div.append('svg')
      .attr('height', 200)

    div.append('div')
      .attr('class', 'triangle');
*/
    const xScale = d3
      .scaleLinear()
      .domain([0, chartOptions.barSummation])
      .range([0, width / 2]);

    chart
      .append('rect')
      .attr('x', xScale(chartOptions.barSummation) - 100)
      .attr('y', 0)
      .attr('width', xScale(chartOptions.barData))
      .attr('height', barHeight)
      .attr('fill', chartOptions.color[0].color1);

    if (chartOptions.color.length === 2) {
      chart
        .append('rect')
        .attr('x', xScale(chartOptions.barData))
        .attr('y', 0)
        .attr('width', xScale(chartOptions.barSummation) - xScale(chartOptions.barData))
        .attr('height', barHeight)
        .attr('fill', chartOptions.color[1].color2);
    }

    if (chartOptions.PCORStarCount > 1) {
      const PCORStars = chartOptions.PCORStarCount;
      const PCORStarXCoordinateMultiplier = 17.5;

      for (let i = 0; i < PCORStars; i++) {
        const xCoordinate = 10 + PCORStarXCoordinateMultiplier * i + xScale(chartOptions.barSummation);
        chart
          .append('g')
          .attr('transform', 'translate(' + xCoordinate + ',' + -10 + ')')
          .append('polygon')
          .attr('fill', '#3381FF')
          .attr(
            'points',
            '8 13.2668737 3.05572809 16 4 10.2111456 -3.02535774e-13 6.11145618 5.52786405 5.26687371 8 0 ' +
              '10.472136 5.26687371 16 6.11145618 12 10.2111456 12.9442719 16'
          );
      }
    } else {
      const textWithHover = chart
        .append('text')
        .attr('x', xScale(chartOptions.barSummation / 10))
        .attr('y', (height + 10) / 2)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .style('text-anchor', 'start')
        .style('font-family', 'UHCSans-Regular')
        .style('font-weight', '500')
        .text(chartOptions.barText);
    }

    chart
      .append('text')
      .attr('x', xScale(chartOptions.barSummation / 1.5))
      .attr('y', (height + 20) / 2)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'start')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text(chartOptions.barData);

    // might have to build a hover object for the long text
    // and add a feature to have the number on the left
  }
}
