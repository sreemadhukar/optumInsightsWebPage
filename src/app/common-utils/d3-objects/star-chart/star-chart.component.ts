import { Component, OnInit, Input, ViewEncapsulation, HostListener, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-star-chart',
  templateUrl: './star-chart.component.html',
  styleUrls: ['./star-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StarChartComponent implements OnInit, AfterViewInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() customWidth: number;
  @Input() customHeight: number;
  @Input() starType: string;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doStarComponent(this.chartOptions, this.customWidth, this.customHeight);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doStarComponent(this.chartOptions, this.customWidth, this.customHeight);
  }

  doStarComponent(chartOptions: any, customWidth: number, customHeight: number) {
    const preWidth = document.getElementsByClassName(chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    let width = preWidth - margin.left - margin.right;
    let height = preWidth - margin.top - margin.bottom;

    if (customWidth > 0) {
      width = customWidth - margin.left - margin.right;
    }

    if (customHeight > 0) {
      height = customHeight - margin.left - margin.right;
    }
    let centerTextFontSize;
    let centerTextHeight;
    if (this.starType === 'app-card') {
      width = 212;
      height = 320;
      centerTextFontSize = 41;
      centerTextHeight = 185;
    } else if (this.starType === 'small-card') {
      width = 120;
      height = 120;
      centerTextFontSize = 22;
      centerTextHeight = width / 2 + 10;
    }

    const svg = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg
      .append('svg:image')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('xlink:href', 'src/assets/images/star.png');

    svg
      .append('text')
      .attr('x', (width + margin.left + margin.right) / 2)
      .attr('y', centerTextHeight)
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .attr('fill', '#FFFFFF')
      .attr('font-size', centerTextFontSize)
      .attr('text-anchor', 'middle')
      .text(chartOptions.centerNumber);
  }
}
