import { Component, OnInit, Input, AfterViewInit, HostListener, ViewEncapsulation, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-star-grey',
  templateUrl: './d3-star-grey.component.html',
  styleUrls: ['./d3-star-grey.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3StarGreyComponent implements OnInit, AfterViewInit, OnChanges {
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
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }

  onSystemChange() {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }

  onResize(event) {
    this.doStarComponent(this.chartOptions.chartData, this.chartOptions.generalData);
  }

  doStarComponent(chartData: any, generalData: any) {
    const preWidth = document.getElementsByClassName(generalData[0].parentDiv)[0].clientWidth;
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
      .attr('x', 20)
      .attr('y', 30)
      .attr('width', 86)
      .attr('height', 90)
      .attr('xlink:href', 'assets/images/Star_Icon2_grey.png');
    svg
      .append('svg:image')
      .attr('x', 28)
      .attr('y', 36)
      .attr('width', 70)
      .attr('height', 80)
      .attr('xlink:href', 'assets/images/Star_Icon_darkgrey.png');
    svg
      .append('svg:image')
      .attr('x', 34)
      .attr('y', 42)
      .attr('width', 58)
      .attr('height', 70)
      .attr('xlink:href', 'assets/images/Star_Icon_white.png');

    svg
      .append('text')
      .attr('x', 63)
      .attr('y', 85)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', '#757588')
      .attr('font-size', '26')
      .attr('text-anchor', 'middle')
      .text(chartData[0].number);

    svg
      .append('text')
      .attr('x', 65)
      .attr('y', 10)
      .attr('font-family', 'UHCSans-SemiBold')
      .attr('fill', '#B3BABC')
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
