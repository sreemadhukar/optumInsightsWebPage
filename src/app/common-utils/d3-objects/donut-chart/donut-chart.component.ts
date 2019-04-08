import { Component, OnInit, Input, HostListener, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DonutChartComponent implements OnInit {
  public transition = 1;
  public noTransition = 0;
  @Input() renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doDonutChart(this.chartOptions, this.noTransition);
  }
  ngOnInit() {
    this.doDonutChart(this.chartOptions, this.transition);
  }

  doDonutChart(chartOptions: any, transition: number) {
    // need to think how else to pass this...
    const preWidth = document.getElementsByClassName('card-inner')[0].clientWidth / 2;
    d3.select('#america')
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;

    const chart = d3
      .select('#america')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('float', 'left')
      .append('g')
      .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

    const radius = Math.min(width, height) / 2;

    const donutColor = d3.scaleOrdinal().range(chartOptions.color);

    let circleThickness = 15;
    if (chartOptions.gdata[0].circumferenceStroke) {
      circleThickness = chartOptions.gdata[0].circumferenceStroke;
    }

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - circleThickness);

    const pie = d3
      .pie()
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .padAngle(0.015)
      .value(function(d) {
        return d.value;
      });

    const text = chart
      .append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '22px')
      .style('font-weight', '600')
      .style('fill', '#2D2D39')
      .style('font-family', 'UHCSans-Regular');

    const donutData = [];

    for (let i = 0; i < chartOptions.cData.length; i++) {
      donutData.push({ name: chartOptions.cValues[i], value: chartOptions.cData[i] });
    }

    const g = chart
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    if (transition) {
      // YES TRANSITION
      g.append('path')
        .style('fill', function(d) {
          return donutColor(d.data.name);
        })
        .transition()
        .delay(function(d, i) {
          return i * 700;
        })
        .duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);

          return function(t) {
            text.text('d');
            text.text();
            d.endAngle = i(t);
            return arc(d);
          };
        });
    } else {
      // NO TRANSITION
      g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
          return donutColor(d.data.name);
        });

      text.text('d');
      text.text();
    }
  }
}
