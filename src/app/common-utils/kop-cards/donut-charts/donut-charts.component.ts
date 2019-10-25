import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
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
  onResize(event) {
    this.doDonutChart(this.chartData, this.quarter, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#miniDonut' + this.quarter.section + this.quarter.id;
  }

  ngAfterViewInit() {
    this.doDonutChart(this.chartData, this.quarter, this.transition);
  }

  doDonutChart(chartData: any, quarter: any, transition: number) {
    function getTextWidth(txt, fontSize, fontFace) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = fontSize + 'px ' + fontFace;
      return context.measureText(txt).width;
    }

    function wrap(textObject, pixelWidth, uniqueID, fontSize) {
      textObject.each(function() {
        let word,
          line = [];
        const textLabel = d3.select(this),
          words = textLabel
            .text()
            .split(/\s+/)
            .reverse(),
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = textLabel.attr('y'),
          dy = parseFloat(textLabel.attr('dy'));
        let tspan = textLabel
          .text(null)
          .append('tspan')
          .attr('x', 12.5)
          .attr('y', y);

        if (!Number.isNaN(dy)) {
          tspan = textLabel
            .text(null)
            .append('tspan')
            .attr('x', 12.5)
            .attr('y', y)
            .attr('dy', dy + 'em');
        }

        let i = 0;
        let dyMultiplier = 1;
        while ((word = words.pop())) {
          line.push(word);
          const line2 = line.join(' ');
          tspan.text(line.join(' '));
          if (getTextWidth(line2, fontSize, 'Arial') > pixelWidth) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = textLabel
              .append('tspan')
              .attr('x', 12.5)
              .attr('y', y)
              .attr('dy', 20 * dyMultiplier + 'px')
              .attr('id', uniqueID + i)
              .text(word);
            i++;
            dyMultiplier++;
          }
        }
      });
    }

    const topFunctions = this;
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
    const graphValues = [quarter.title.toFixed(), 100 - quarter.title.toFixed()];

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
        .delay(function(d, i) {
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
