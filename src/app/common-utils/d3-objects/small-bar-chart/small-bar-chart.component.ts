import { Component, OnInit, Input, HostListener, AfterViewInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-small-bar-chart',
  templateUrl: './small-bar-chart.component.html',
  styleUrls: ['./small-bar-chart.component.scss']
})
export class SmallBarChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() chartOptions;
  @Input() height;
  @Input() width;
  @Input() custom;
  renderChart;
  constructor() {}
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doSmallBarChart(this.chartOptions);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doSmallBarChart(this.chartOptions);
  }
  ngOnChanges() {
    this.doSmallBarChart(this.chartOptions);
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }
  doSmallBarChart(chartOptions: any) {
    const preWidth = document.getElementsByClassName(chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let data = chartOptions.chartData;
    const barColors = chartOptions.color;

    data = data.sort(function(a, b) {
      return d3.ascending(a.values, b.values);
    });
    const minValue = data[0].values;
    const sumData = parseFloat(data[1].values + data[0].values); // it will be used to place labels at right correctly
    const posLabelRight = minValue / sumData; // lowest divide by sum

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 0, bottom: 0, left: 0 };
    let width;
    if (!this.custom) {
      width = preWidth;
    } else {
      width = this.width;
    }
    const height = this.height;

    // set the ranges
    const yScale = d3
      .scaleBand()
      .range([height - 35, 0])
      .padding(0.1);

    const xScale = d3.scaleLinear().range([0, width / 2]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    const svg = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
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
    const colorFunction = function(i) {
      return barColors[i];
    };
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
      .attr('fill', function(d, i) {
        return colorFunction(i);
      })
      .attr('transform', 'translate(' + 0 + ',' + 10 + ')');

    svg
      .selectAll('.metricName')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', '16px')
      .style('fill', '#2d2d39')
      .style('font-weight', '500')
      .style('font-family', 'UHCSans-Medium')
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
      .style('font-size', '14px')
      .style('fill', '#2d2d39')
      .style('font-weight', '600')
      .style('font-family', 'UHCSans-SemiBold')
      // y position of the label is halfway down the bar
      .attr('y', function(d) {
        return yScale(d.labelsRight) + yScale.bandwidth() / 2;
      })
      // x position is 3 pixels to the right of the bar
      .attr('x', function(d) {
        return xScale(d.values + posLabelRight);
      })
      .text(function(d) {
        return d.labelsRight;
      });

    // add   the x Axis
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
