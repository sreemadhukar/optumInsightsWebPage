import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
@Component({
  selector: 'app-color-grey-mini-bar-chart',
  templateUrl: './color-grey-mini-bar-chart.component.html',
  styleUrls: ['./color-grey-mini-bar-chart.component.scss']
})
export class ColorGreyMiniBarChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  printStyle: boolean;
  @Input() chartOptions: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }
  ngAfterViewInit() {
    this.doBarChart(this.chartOptions, this.transition);
  }

  doBarChart(chartOptions: any, transition: number) {}
}
