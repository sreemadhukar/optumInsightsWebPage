import { Component, OnInit, Input, AfterViewInit, HostListener, ViewEncapsulation, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-star-blue',
  templateUrl: './d3-star-blue.component.html',
  styleUrls: ['./d3-star-blue.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3StarBlueComponent implements OnInit, AfterViewInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}
  @HostListener('window:resize', ['$event'])
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.gdata[1]);
  }

  onSystemChange() {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.gdata[1]);
  }

  onResize(event) {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.gdata[1]);
  }

  doStarComponent(chartData: any, gdata: any) {
    const preWidth = document.getElementsByClassName(gdata[1].parentDiv)[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 0, bottom: 10, left: 0 },
      width = preWidth - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    const svg = d3
      .select(this.renderChart)
      .selectAll('svg')
      .data(chartData)
      .enter()
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const x = 30;
    const y = 15;

    const multiplier = 8;
    const x1 = multiplier * 9.9 + x;
    const y1 = multiplier * 1.1 + y;
    const x2 = multiplier * 3.3 + x;
    const y2 = multiplier * 21.78 + y;
    const x3 = multiplier * 19.8 + x;
    const y3 = multiplier * 8.58 + y;
    const x4 = multiplier * 0 + x;
    const y4 = multiplier * 8.58 + y;
    const x5 = multiplier * 16.5 + x;
    const y5 = multiplier * 21.78 + y;
    svg
      .append('svg:image')
      .attr('x', 28)
      .attr('y', 36)
      .attr('width', 66)
      .attr('height', 70)
      .attr('xlink:href', 'assets/images/Star_Icon2_blue.png');

    svg
      .append('text')
      .attr('x', 60)
      .attr('y', 80)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '26')
      .attr('text-anchor', 'middle')
      .text(chartData[0].number);

    svg
      .append('text')
      .attr('x', 65)
      .attr('y', 10)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', 'black')
      .attr('font-size', '16')
      .attr('text-anchor', 'middle')
      .text(chartData[0].titleOne);

    svg
      .append('text')
      .attr('x', 60)
      .attr('y', 125)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', 'black')
      .attr('font-size', '16')
      .attr('text-anchor', 'middle')
      .text(chartData[0].titleTwo);
  }
}
