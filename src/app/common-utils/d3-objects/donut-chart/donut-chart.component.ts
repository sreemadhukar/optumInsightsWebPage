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
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doDonutChart(this.chartOptions.chartData, this.chartOptions.generalData, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.chartId;
    this.doDonutChart(this.chartOptions.chartData, this.chartOptions.generalData, this.transition);
  }

  doDonutChart(chartData: any, generalData: any, transition: number) {
    const preWidth = document.getElementById(generalData[0].parentDiv).clientWidth / 2;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('float', 'left')
      .append('g')
      .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

    const radius = Math.min(width, height) / 2;

    let color;
    if (generalData[0].color4) {
      color = d3
        .scaleOrdinal()
        .range([generalData[0].color1, generalData[0].color2, generalData[0].color3, generalData[0].color4]);
    } else if (generalData[0].color3) {
      color = d3.scaleOrdinal().range([generalData[0].color1, generalData[0].color2, generalData[0].color3]);
    } else if (generalData[0].color2) {
      color = d3.scaleOrdinal().range([generalData[0].color1, generalData[0].color2]);
    } else {
      color = d3.scaleOrdinal().range([generalData[0].color1]);
    }

    let circleThickness = 20;
    if (generalData[0].circumferenceStroke) {
      circleThickness = generalData[0].circumferenceStroke;
    }

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - circleThickness);

    let pie;
    if (generalData[0].type === 'arc-padding') {
      pie = d3
        .pie()
        .sort(null)
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .padAngle(0.015)
        .value(function(d) {
          return d.value;
        });
    } else {
      pie = d3
        .pie()
        .sort(null)
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .value(function(d) {
          return d.value;
        });
    }

    const text_x = 2;
    const text_y = 2;

    const text = chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + text_x + ',' + text_y + ')')
      .style('font-size', '22px')
      .style('font-weight', '600')
      .style('fill', '#2D2D39')
      .style('font-family', 'UHCSans-Regular');

    const text2 = chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + text_x + ',' + (text_y + 25) + ')')
      .style('font-size', '16px')
      .style('fill', '#2D2D39')
      .style('font-weight', '700')
      .style('font-family', 'UHCSans-SemiBold');

    const g = chart
      .selectAll('.arc')
      .data(pie(chartData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    if (transition) {
      // YES TRANSITION
      g.append('path')
        .style('fill', function(d) {
          return color(d.data.name);
        })
        .transition()
        .delay(function(d, i) {
          return i * 700;
        })
        .duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function(t) {
            text.text(generalData[0].amount);
            text2.text(generalData[0].desc1);
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
          return color(d.data.name);
        });

      text.text(generalData[0].amount);
      text2.text(generalData[0].desc1);
      text.text();
    }
  }
}
