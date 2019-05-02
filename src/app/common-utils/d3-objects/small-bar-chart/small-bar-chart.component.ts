import { Component, OnInit, Input, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-small-bar-chart',
  templateUrl: './small-bar-chart.component.html',
  styleUrls: ['./small-bar-chart.component.scss']
})
export class SmallBarChartComponent implements OnInit, AfterViewInit {
  @Input() chartOptions;
  renderChart;
  constructor() {}
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doSmallBarChart();
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doSmallBarChart();
  }

  doSmallBarChart() {
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let data = this.chartOptions.chartData;
    console.log('data', data);
    data = data.sort(function(a, b) {
      return d3.ascending(a.values, b.values);
    });

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = preWidth - margin.left - margin.right,
      height = 160 - margin.top - margin.bottom;

    // set the ranges
    const yScale = d3
      .scaleBand()
      .range([height, 0])
      .padding(0.1);

    const xScale = d3.scaleLinear().range([0, width / 1.5]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    const svg = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // format the data
    data.forEach(function(d) {
      d.values = +d.values;
    });

    // Scale the range of the data in the domains
    xScale.domain([
      0,
      d3.max(data, function(d) {
        return d.values;
      })
    ]);
    yScale.domain(
      data.map(function(d) {
        return d.labelsRight;
      })
    );
    // y.domain([0, d3.max(data, function(d) { return d.values; })]);

    // append the rectangles for the bar chart
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', function(d) {
        return xScale(d.values);
      })
      .attr('y', function(d) {
        return yScale(d.labelsRight);
      })
      .attr('height', yScale.bandwidth() - 28)
      .attr('fill', this.chartOptions.color[0])
      .attr('transform', 'translate(' + 0 + ',' + 10 + ')');

    svg
      .selectAll('.metricName')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', '14px')
      .style('fill', '#757588')
      .style('font-weight', '600')
      .style('font-family', 'UHCSans-SemiBold')
      .attr('y', function(d) {
        return yScale(d.labelsRight);
      })
      .attr('x', 0)
      .text(function(d) {
        return d.metricName;
      });

    svg
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', '12px')
      .style('fill', '#757588')
      .style('font-weight', '600')
      .style('font-family', 'UHCSans-SemiBold')
      // y position of the label is halfway down the bar
      .attr('y', function(d) {
        return yScale(d.labelsRight) + yScale.bandwidth() / 2;
      })
      // x position is 3 pixels to the right of the bar
      .attr('x', function(d) {
        return xScale(d.values + 3);
      })
      .text(function(d) {
        return d.labelsRight;
      });

    // add the x Axis
    /*
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    */
    // add the y Axis
    /*
    svg.append("g").call(d3.axisLeft(y));
    */
  }
}
