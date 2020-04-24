import { Component, OnInit, Input, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-charts',
  templateUrl: './donut-charts.component.html',
  styleUrls: ['./donut-charts.component.scss']
})
export class DonutChartsComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  public color: any = [];
  @Input() quarter: any;
  @Input() chartData: any = {};
  @Input() donutType: string;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.doDonutChart(this.chartData, this.quarter, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#miniDonut' + this.quarter.section + this.quarter.id;
  }

  ngAfterViewInit() {
    this.doDonutChart(this.chartData, this.quarter, this.transition);
  }

  doDonutChart(chartData: any, quarter: any, transition: number) {
    const preWidth = 150;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    let width = preWidth - margin.left - margin.right;
    let height = width - margin.top - margin.bottom;

    let radius = Math.min(width, height) / 1.5;
    let circleThickness = 15;
    width = 72;
    height = 72;
    radius = 36;
    circleThickness = 8;

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
      .padAngle(0.01)
      .value(function(d) {
        return d.value;
      });

    let heightDivider = 16;
    if (chartData.sdata) {
      heightDivider = -16;
    }
    let text;
    text = chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', height / heightDivider)
      .style('font-size', '22px')
      .style('fill', '#2d2d39')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'");
    text = chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 8)
      .style('font-size', '16px')
      .style('fill', '#2d2d39')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'");

    const donutData = [];
    if (quarter.id === 0) {
      this.color = ['#3381FF', '#E0E0E0'];
    } else if (quarter.id === 1) {
      this.color = ['#00B8CC', '#E0E0E0'];
    }
    const donutColor = d3.scaleOrdinal().range(this.color);
    const graphValue = quarter && quarter.title ? quarter.title.toFixed() : 0;
    const graphValues = [graphValue, 100 - graphValue];

    // if (chartData.hasOwnProperty('labels')) {
    //   for (let i = 0; i < chartData.graphValues.length; i++) {
    //     donutData.push({
    //       value: chartData.graphValues[i],
    //       label: chartData.labels[i],
    //       color: chartData.color[i]
    //     });
    //   }
    // } else {
    for (let i = 0; i < graphValues.length; i++) {
      donutData.push({ value: graphValues[i], color: this.color[i] });
    }
    // }

    const g = chart
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    if (transition) {
      g.append('path')
        .style('fill', function(d) {
          return donutColor(d.data.color);
        })
        .transition()
        .delay(function(_d, i) {
          return i * 700;
        })
        .duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function(t) {
            text.text(quarter.title + '%');
            text.text();
            d.endAngle = i(t);
            return arc(d);
          };
        });
    } else {
      g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
          return donutColor(d.data.color);
        });

      text.text(quarter.title + '%');
      text.text();
    }
  }
}
