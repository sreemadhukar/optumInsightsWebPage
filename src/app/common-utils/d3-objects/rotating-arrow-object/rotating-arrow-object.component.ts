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

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doRotatingArrowChart(this.chartOptions);
  }
  ngOnInit() {
    this.renderChart = '#' + 'lol';
  }

  ngAfterViewInit() {
    this.doRotatingArrowChart(this.chartOptions);
  }

  doRotatingArrowChart(chartOptions: any) {
    const preWidth = document.getElementsByClassName('card-inner-large')[0].clientWidth / 3;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = width - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart
      .append('path')
      .attr(
        'd',
        'M13.3745958,70.6781358 C16.0246394,63.1778965 21.4761761,65.1040763 29.7292061,76.4566752 ' +
          'C26.4076614,85.8574191 24.689995,95.8052714 24.689995,106 C24.689995,154.962553 64.381987,194.654545 ' +
          '113.34454,194.654545 C119.136709,194.654545 127.432885,193.430905 138.233071,190.983625 L138.233068,190.983614 ' +
          'C139.248023,190.75363 140.269742,191.340421 140.58257,192.332976 L144.6552,205.25488 C144.98464,206.300141 ' +
          '144.411483,207.415845 143.36992,207.756798 C134.728334,210.585599 124.719874,212 113.34454,212 C54.8024898,212 ' +
          '7.34454042,164.542183 7.34454042,106 C7.34454042,93.8299552 9.39953058,81.9284948 13.3745958,70.6781358 Z ' +
          'M216.047392,132.326622 L199.242357,128.030625 C201.066569,120.894693 201.999086,113.512528 201.999086,106 ' +
          'C201.999086,57.0374465 162.307094,17.3454545 113.34454,17.3454545 C108.189668,17.3454545 100.792064,18.3171592 ' +
          '91.151727,20.2605685 L91.1517261,20.2605643 C90.125679,20.4674066 89.1136953,19.8481529 88.830887,18.840395 ' +
          'L85.1707893,5.79807155 C84.8755765,4.74611129 85.4792075,3.65191999 86.5265088,3.3405827 C94.0180556,1.11352757 ' +
          '102.957399,0 113.34454,0 C171.886724,0 219.34454,47.4578165 219.34454,106 C219.34454,114.964497 218.229728,123.789785 ' +
          '216.047392,132.326622 Z'
      )
      .attr('fill', '#3381FF');

    chart
      .append('path')
      .attr(
        'd',
        'M27.5674692,47.3036737 L44.6244905,81.3393267 C45.1193785,82.3268284 44.7200362,83.5285427 43.7325345,84.0234307 ' +
          'C43.4539073,84.1630652 43.146503,84.2356519 42.8348448,84.2354001 L8.7758314,84.2078855 ' +
          'C7.67126226,84.2069932 6.77655543,83.3108396 ' +
          '6.77744775,82.2062704 C6.77769812,81.8963592 6.84996601,81.5907462 6.98854902,81.3135464 ' +
          'L23.9905411,47.305408 C24.4844713,46.3174268 ' +
          '25.6857978,45.9169195 26.673779,46.4108497 C27.0603096,46.6040914 27.3738527,46.9173306 27.5674692,47.3036737 Z'
      )
      .attr(
        'transform',
        'translate(25.807172, 65.217355) scale(1, -1) rotate(-208.000000) translate(-25.807172, -65.217355)'
      )
      .attr('fill', '#3381FF');

    chart
      .append('path')
      .attr(
        'd',
        'M200.756181,127.643865 L217.811855,161.673292 C218.306784,162.660773 217.907492,163.862504 216.920011,164.357433 ' +
          'C216.641429,164.49706 216.334075,164.569659 216.022461,164.56944 L181.958861,164.545566 ' +
          'C180.854292,164.544792 179.959489,163.648734 ' +
          '179.960263,162.544165 C179.96048,162.234067 180.032803,161.928267 180.171517,161.650923 ' +
          'L197.179442,127.64537 C197.673541,126.657473 ' +
          '198.874935,126.25717 199.862832,126.751268 C200.249201,126.94451 200.562614,127.25766 200.756181,127.643865 Z'
      )
      .attr(
        'transform',
        'translate(198.992281, 145.554508) scale(-1, 1) rotate(157.000000) translate(-198.992281, -145.554508) '
      )
      .attr('fill', '#3381FF');

    if (chartOptions.sdata) {
      if (chartOptions.sdata.sign === 'up') {
        chart
          .append('circle')
          .attr('cx', width / 4)
          .attr('cy', height / 3)
          .attr('r', 16)
          .attr('fill', '#FFE6F0');

        chart
          .append('svg:image')
          .attr('x', width / 4.5)
          .attr('y', height / 3.25)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/trend-up.svg');

        chart
          .append('text')
          .attr('x', width / 3.25)
          .attr('y', height / 2.875)
          .style('font-size', '16px')
          .style('font-weight', '500')
          .style('fill', '#B10C00')
          .style('font-family', 'UHCSans-Regular')
          .style('text-anchor', 'start')
          .text(chartOptions.sdata.data);
      } else if (chartOptions.sdata.sign === 'down') {
        chart
          .append('circle')
          .attr('cx', width / -8)
          .attr('cy', height / 6)
          .attr('r', 16)
          .attr('fill', '#E1FADF');

        chart
          .append('svg:image')
          .attr('x', width / -5)
          .attr('y', height / 10)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/trend-down.svg');

        chart
          .append('text')
          .attr('x', width / 256)
          .attr('y', height / 5)
          .style('font-size', '16px')
          .style('font-weight', '500')
          .style('fill', '#007000')
          .style('font-family', 'UHCSans-Regular')
          .style('text-anchor', 'start')
          .text(chartOptions.sdata.data);
      }
    }

    chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', height / 2)
      .attr('x', width)
      .style('font-size', '41px')
      .style('font-weight', '500')
      .style('fill', '#2D2D39')
      .style('font-family', 'UHCSans-Regular')
      .text('0.0');
  }
}
