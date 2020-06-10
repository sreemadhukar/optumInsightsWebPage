import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-common-bar',
  templateUrl: './common-bar.component.html',
  styleUrls: ['./common-bar.component.scss']
})
export class CommonBarComponent implements OnInit, AfterViewInit {
  @Input() config;
  id: any;
  percentage = '65%';
  constructor() {}

  ngOnInit() {
    this.id = this.config.id;
  }
  ngAfterViewInit() {
    this.bar();
  }
  bar() {
    let remainingPercentage = 100;
    const whiteGapWidth = (1.5 / parseInt(this.config.width)) * 100; // 1.5 is the practical px size of the gap now it is 1.5px

    const barBody = d3
      .select('#' + this.id)
      .append('svg')
      .attr('height', this.config.height)
      .attr('width', this.config.width)
      .style('overflow', 'visible')
      .append('g');
    const bar = barBody;
    for (let i = 0; i < this.config.percentage.length; i++) {
      if (this.config.percentage[i] > 0) {
        bar
          .append('rect')
          .attr('x', 100 - remainingPercentage + '%')
          .attr('width', this.config.percentage[i] - whiteGapWidth + '%')
          .attr('height', '100%')
          .attr('fill', this.config.color[i]);
        bar
          .append('rect')
          .attr('x', 100 - remainingPercentage + this.config.percentage[i] - whiteGapWidth + '%')
          .attr('width', whiteGapWidth + '%')
          .attr('height', '100%')
          .attr('fill', 'white');
        remainingPercentage = remainingPercentage - this.config.percentage[i];
      }
    }
    bar
      .append('rect')
      .attr('x', 100 - remainingPercentage + '%')
      .attr('width', remainingPercentage + '%')
      .style('height', '100%')
      .attr('fill', this.config.color[this.config.color.length - 1]);

    if (this.config.baseLine) {
      bar
        .append('line')
        .attr('x1', this.config.baseLine + '%')
        .attr('y1', -5)
        .attr('x2', this.config.baseLine + '%')
        .attr('y2', parseInt(this.config.height) + 5)
        .style('stroke-dasharray', '7,3')
        .style('stroke', 'black')
        .style('stroke-width', '2px');
    }
  }
}
