import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-claims-paid-bar-graph',
  templateUrl: './claims-paid-bar-graph.component.html',
  styleUrls: ['./claims-paid-bar-graph.component.scss']
})
export class ClaimsPaidBarGraphComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doBarGraph(this.chartOptions, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doBarGraph(this.chartOptions, this.transition);
  }

  doBarGraph(chartOptions: any, transition: number) {
    // might have to hard code class names for testing
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth;
    const preHeight = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientHeight;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    // make sure to verify height if something looks off
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = preHeight - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart
      .append('text')
      .attr('x', width / 3)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Total Billed');

    chart
      .append('text')
      .attr('x', width / 3 + 50)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$856M');

    chart
      .append('text')
      .attr('x', width / 3)
      .attr('y', 200)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Actual Allowed*');

    chart
      .append('text')
      .attr('x', width / 3 + 50)
      .attr('y', 200)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$645M');

    chart
      .append('text')
      .attr('x', width / 3)
      .attr('y', 400)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Estimated Non-Payment');

    chart
      .append('text')
      .attr('x', width / 3 + 50)
      .attr('y', 400)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$211M');

    chart
      .append('text')
      .attr('x', width / 3)
      .attr('y', 500)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Total Paid By UHC');

    chart
      .append('text')
      .attr('x', width / 3 + 50)
      .attr('y', 500)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$571M');
  }
}
