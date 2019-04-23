import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rotating-arrow-object',
  templateUrl: './rotating-arrow-object.component.html',
  styleUrls: ['./rotating-arrow-object.component.scss']
})
export class RotatingArrowObjectComponent implements OnInit, AfterViewInit {
  public renderChart: string;
  @Input() chartOptions: any = {};

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doRotatingArrowChart(this.chartOptions);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doRotatingArrowChart(this.chartOptions);
  }

  doRotatingArrowChart(chartOptions: any) {
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth / 2;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;
  }
}
