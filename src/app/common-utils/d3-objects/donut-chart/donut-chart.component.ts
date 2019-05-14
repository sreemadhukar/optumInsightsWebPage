import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DonutChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() donutType: string;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doDonutChart(this.chartOptions, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doDonutChart(this.chartOptions, this.transition);
  }

  doDonutChart(chartOptions: any, transition: number) {
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth / 2;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    let width = preWidth - margin.left - margin.right;
    let height = width - margin.top - margin.bottom;

    let radius = Math.min(width, height) / 2.5;
    const donutColor = d3.scaleOrdinal().range(chartOptions.color);
    let circleThickness = 15;
    if (this.donutType === 'app-card') {
      width = 212;
      height = 212;
      radius = 105;
      circleThickness = 23;
    } else if (this.donutType === 'small-card') {
      width = 129;
      height = 129;
      radius = 64;
      circleThickness = 16;
    }

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - circleThickness);

    const pie = d3
      .pie()
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .padAngle(0.02)
      .value(function(d) {
        return d.value;
      });

    let heightDivider = 16;
    if (chartOptions.sdata) {
      heightDivider = -16;
    }
    let text;
    if (this.donutType === 'app-card') {
      text = chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', height / height)
        .style('font-size', '41px')
        .style('fill', '#2d2d39')
        .style('font-family', 'UHCSans-Regular');
    } else if (this.donutType === 'small-card') {
      text = chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', height / heightDivider)
        .style('font-size', '22px')
        .style('fill', '#2d2d39')
        .style('font-family', 'UHCSans-SemiBold');
    }

    if (chartOptions.hasOwnProperty('sdata') && chartOptions.sdata != null) {
      if (chartOptions.sdata.sign === 'up') {
        chart
          .append('circle')
          .attr('cx', -24)
          .attr('cy', 29)
          .attr('r', 16)
          .attr('fill', '#e1fadf');

        chart
          .append('svg:image')
          .attr('x', -36)
          .attr('y', 19)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/trend-down.svg');

        chart
          .append('text')
          .attr('x', 0)
          .attr('y', 32)
          .style('font-size', '14px')
          .style('font-weight', '500')
          .style('fill', '#007000')
          .style('font-family', 'UHCSans-Regular')
          .style('text-anchor', 'start')
          .text(chartOptions.sdata.data);
      } else if (chartOptions.sdata.sign === 'down') {
        chart
          .append('circle')
          .attr('cx', -24)
          .attr('cy', 29)
          .attr('r', 16)
          .attr('fill', '#ffe6f0');

        chart
          .append('svg:image')
          .attr('x', -36)
          .attr('y', 19)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/trend-up.svg');

        chart
          .append('text')
          .attr('x', 0)
          .attr('y', 32)
          .style('font-size', '14px')
          .style('font-weight', '500')
          .style('fill', '#b10c00')
          .style('font-family', 'UHCSans-Regular')
          .style('text-anchor', 'start')
          .text(chartOptions.sdata.data);
      }
    }

    const donutData = [];

    for (let i = 0; i < chartOptions.graphValues.length; i++) {
      donutData.push({ value: chartOptions.graphValues[i] });
    }

    const g = chart
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    if (transition) {
      g.append('path')
        .style('fill', function(d) {
          return donutColor(d.data.value);
        })
        .transition()
        .delay(function(d, i) {
          return i * 700;
        })
        .duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function(t) {
            text.text(chartOptions.centerNumber);
            text.text();
            d.endAngle = i(t);
            return arc(d);
          };
        });
    } else {
      g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
          return donutColor(d.data.value);
        });

      text.text(chartOptions.centerNumber);
      text.text();
    }
  }
}
