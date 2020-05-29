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
    const barBody = d3.select('#' + this.id);
    const bar = barBody
      .append('div')
      .style('width', this.config.width)
      .style('height', this.config.height)
      .style('display', 'flex')
      .style('border-radius', '0 2px 2px 0');
    bar
      .append('div')
      .style('width', this.config.percentage)
      .style('height', '100%')
      .style('background-color', this.config.color[0]);
    bar
      .append('div')
      .style('width', '1px')
      .style('height', '100%')
      .style('background-color', 'white');
    bar
      .append('div')
      .style('flex-grow', '1')
      .style('height', '100%')
      .style('background-color', this.config.color[1])
      .style('border-radius', '0 2px 2px 0');
  }
}
