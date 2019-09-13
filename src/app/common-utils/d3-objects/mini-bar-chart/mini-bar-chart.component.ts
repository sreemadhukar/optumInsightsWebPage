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
    let chart;
    if (chartOptions.page === 'ACO') {
      chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 10)
        .append('g')
        .attr('transform', 'translate(' + 7 + ',' + 0 + ')');
    } else {
      chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + 7 + ',' + 0 + ')');
    }
    let totalSum = 0;

    for (let i = 0; i < chartOptions.graphValues.length; i++) {
      totalSum = totalSum + Number(chartOptions.graphValues[i]);
    }

    function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
      let retval;
      retval = 'M' + (x + r) + ',' + y;
      retval += 'h' + (w - 2 * r);
      if (tr) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r;
      } else {
        retval += 'h' + r;
        retval += 'v' + r;
      }
      retval += 'v' + (h - 2 * r);
      if (br) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + r;
      } else {
        retval += 'v' + r;
        retval += 'h' + -r;
      }
      retval += 'h' + (2 * r - w);
      if (bl) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + -r + ',' + -r;
      } else {
        retval += 'h' + -r;
        retval += 'v' + -r;
      }
      retval += 'v' + (2 * r - h);
      if (tl) {
        retval += 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r;
      } else {
        retval += 'v' + -r;
        retval += 'h' + r;
      }
      retval += 'z';
      return retval;
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, totalSum])
      .range([0, 178]);

    if (chartOptions.page === 'ACO') {
      chart
        .append('path')
        .attr('d', rounded_rect(10, 26, xScale(chartOptions.graphValues[0]), 16, 3, 3, 0, 3, 0))
        .attr('fill', chartOptions.color[0]);

      chart
        .append('text')
        .attr('font-family', 'UHCSans-Medium')
        .attr('font-size', '16px')
        .attr('x', xScale(chartOptions.graphValues[0]).toFixed(0) / 2 + 5)
        .attr('y', 21)
        .text(chartOptions.graphValues[0]);

      chart
        .append('rect')
        .attr('rx', 0)
        .attr('x', 10 + xScale(chartOptions.graphValues[0]))
        .attr('y', 30)
        .attr('width', 2)
        .attr('height', 16)
        .attr('fill', chartOptions.color[1]);

      chart
        .append('path')
        .attr(
          'd',
          rounded_rect(
            12 + xScale(chartOptions.graphValues[0]),
            26,
            xScale(chartOptions.graphValues[1]) - 20,
            16,
            3,
            0,
            3,
            0,
            3
          )
        )
        .attr('fill', chartOptions.color[2]);

      chart
        .append('text')
        .attr('font-family', 'UHCSans-Medium')
        .attr('font-size', '16px')
        .attr('x', xScale(chartOptions.graphValues[0]) + xScale(chartOptions.graphValues[1]) / 2 - 12)
        .attr('y', 21)
        .text(chartOptions.graphValues[1]);
    } else {
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
}
