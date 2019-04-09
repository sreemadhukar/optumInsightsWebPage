import { Component, OnInit, Input, ViewEncapsulation, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-star-chart',
  templateUrl: './star-chart.component.html',
  styleUrls: ['./star-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class StarChartComponent implements OnInit, AfterViewInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doStarComponent(this.chartOptions);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    console.log('d');
    this.doStarComponent(this.chartOptions);
  }

  doStarComponent(chartOptions: any) {
    const preWidth = document.getElementsByClassName(chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
      width = preWidth - margin.left - margin.right,
      height = preWidth - margin.top - margin.bottom;

    const svg = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg
      .append('svg:image')
      .attr('x', 20)
      .attr('y', 20)
      .attr('width', 160)
      .attr('height', 168)
      .attr('xlink:href', 'src/assets/images/star.png');

    svg
      .append('text')
      .attr('x', 100)
      .attr('y', 123)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '36')
      .attr('text-anchor', 'middle')
      .text(chartOptions.centerText);
  }
}
