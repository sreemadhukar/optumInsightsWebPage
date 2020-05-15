import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rotating-arrow-object',
  templateUrl: './rotating-arrow-object.component.html',
  styleUrls: ['./rotating-arrow-object.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RotatingArrowObjectComponent implements OnInit, AfterViewInit {
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() customWidth: number;
  @Input() customHeight: number;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.doRotatingArrowChart(this.chartOptions, this.customWidth);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doRotatingArrowChart(this.chartOptions, this.customWidth);
  }

  doRotatingArrowChart(chartOptions: any, customWidth: number) {
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let width = 230;
    // let height = 220;

    if (customWidth > 0) {
      width = customWidth;
    }

    const tatCircleLink = 'src/assets/images/TATCirclewithArrow.png';

    if (chartOptions.gdata[1] === 'appealsAverageTurnAround') {
      const chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', 350)
        .attr('height', 220)
        .append('g')
        .attr('transform', 'translate(' + 55 + ',' + -6 + ')');

      chart
        .append('svg:image')
        .attr('x', 10)
        .attr('y', 0)
        .attr('width', '220px')
        .attr('height', '220px')
        .attr('xlink:href', tatCircleLink);

      // let circleColor;
      // let textColor;
      // let arrowLink;
      if (chartOptions.sdata) {
      }

      chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 125)
        .attr('x', 125)
        .style('font-size', '41px')
        .style('fill', '#2D2D39')
        .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .style('letter-spacing', '-0.5px')
        .text(chartOptions.centerNumber);
    } else {
      const chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', width)
        .attr('height', 220)
        .append('g')
        .attr('transform', 'translate(' + -10 + ',' + -6 + ')');

      chart
        .append('svg:image')
        .attr('x', 10)
        .attr('y', 0)
        .attr('width', '220px')
        .attr('height', '220px')
        .attr('xlink:href', tatCircleLink);
      // let circleColor;
      // let textColor;
      // let arrowLink;
      chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 125)
        .attr('x', 125)
        .style('font-size', '41px')
        .style('fill', '#2D2D39')
        .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .style('letter-spacing', '-0.5px')
        .text(chartOptions.centerNumber);
    }
  }
}
