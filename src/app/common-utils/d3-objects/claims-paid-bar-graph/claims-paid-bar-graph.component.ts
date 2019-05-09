import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-claims-paid-bar-graph',
  templateUrl: './claims-paid-bar-graph.component.html',
  styleUrls: ['./claims-paid-bar-graph.component.scss']
})
export class ClaimsPaidBarGraphComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};
  public testID = 'lolol';

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doBarGraph(this.chartOptions, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.testID;
  }

  ngAfterViewInit() {
    this.doBarGraph(this.chartOptions, this.transition);
  }

  formatDynamicAbbreviation(tickNumber: number, tickValue: number, prefix: string) {
    // zero is false and one is true
    const q = tickValue;
    const w = tickNumber - 1;
    const step = q / w;
    let zeroOrOne;
    let abbreviation;

    const maxTickValueStringLength = q.toString().length;
    const stepStringLength = step.toString().length;

    if (maxTickValueStringLength === stepStringLength) {
      zeroOrOne = 0;
    } else if (maxTickValueStringLength % 3 === 0 || maxTickValueStringLength % 5 === 0) {
      zeroOrOne = 0;
    } else {
      zeroOrOne = 1;
    }

    // 6 = T, 5 = B, 4 = M, 3 = K, 2 = mid-K, 1=hundreds

    if (q >= 1000000000) {
      abbreviation = 9;
    } else if (q >= 1000000) {
      abbreviation = 6;
    } else if (q >= 1000) {
      abbreviation = 3;
    } else {
      abbreviation = 0;
    }

    const newFormatNumber = d3.format(',.0f'),
      formatBillion = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumber(x / 1e9) + 'B';
        }
      },
      formatMillion = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumber(x / 1e6) + 'M';
        }
      },
      formatThousand = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumber(x / 1e3) + 'K';
        }
      },
      formatZero = function(x) {
        return prefix + newFormatNumber(x);
      };

    const newFormatNumberOne = d3.format('.1f'),
      formatBillionOne = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumberOne(x / 1e9) + 'B';
        }
      },
      formatMillionOne = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumberOne(x / 1e6) + 'M';
        }
      },
      formatThousandOne = function(x) {
        if (x === 0) {
          return prefix + '0';
        } else {
          return prefix + newFormatNumberOne(x / 1e3) + 'K';
        }
      },
      formatZeroOne = function(x) {
        return prefix + newFormatNumberOne(x);
      };

    const flag = abbreviation + zeroOrOne;
    switch (flag) {
      case 10:
        return formatBillionOne;
      case 9:
        return formatBillion;
      case 7:
        return formatMillionOne;
      case 6:
        return formatMillion;
      case 4:
        return formatThousandOne;
      case 3:
        return formatThousand;
      case 1:
        return formatZeroOne;
      case 0:
        return formatZero;
      default:
        break;
    }
  }

  doBarGraph(chartOptions: any, transition: number) {
    // might have to hard code class names for testing
    const className = 'claims-paid-content'; // 'card-inner-large'
    // this.chartOptions.gdata[0]
    //
    const preWidth = document.getElementsByClassName(className)[0].clientWidth;
    const preHeight = document.getElementsByClassName(className)[0].clientHeight;
    console.log(preWidth, preHeight);
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    // make sure to verify height if something looks off
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = preHeight - margin.top - margin.bottom;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart
      .append('text')
      .attr('x', 22)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Total Billed');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$856M');

    chart
      .append('text')
      .attr('x', 22)
      .attr('y', 180)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Actual Allowed*');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 180)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$645M');

    chart
      .append('text')
      .attr('x', 22)
      .attr('y', 230)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Estimated Non-Payment');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 230)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$211M');

    chart
      .append('text')
      .attr('x', 22)
      .attr('y', 310)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('Total Paid By UHC');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 310)
      .attr('fill', '#2D2D39')
      .attr('font-size', '22')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '600')
      .text('$571M');

    chart
      .append('text')
      .attr('x', 900)
      .attr('y', 30)
      .attr('fill', '#2D2D39')
      .attr('font-size', '12')
      .style('text-anchor', 'end')
      .style('font-family', 'UHCSans-Regular')
      .style('font-weight', '500')
      .text('*Includes Member Responsibility');

    chart
      .append('line')
      .attr('x1', 400)
      .attr('y1', 55)
      .attr('x2', 400)
      .attr('y2', 350)
      .attr('stroke', '#757588')
      .attr('stroke-width', '1px');

    const highestValue = 300;
    const xScale = d3
      .scaleLinear()
      .domain([0, highestValue])
      .range([400, 900])
      .nice(3);

    chart
      .append('g')
      .attr('visibility', 'hidden')
      .attr('id', 'forCalculations')
      .call(
        d3
          .axisBottom(xScale)
          .ticks(3)
          .tickSize(295)
      );

    const preArray = d3
      .select('#forCalculations')
      .selectAll('.tick>text')
      .nodes()
      .map(function(t) {
        return t.innerHTML;
      });

    d3.select('#forCalculations').remove();

    for (let i = 0; i < preArray.length; i++) {
      preArray[i] = preArray[i].replace(/,/g, '');
    }

    const preArrayOfNumbers = preArray.map(Number);
    const numberOfTicks = preArrayOfNumbers.length;
    const highestTickValue = preArrayOfNumbers[numberOfTicks - 1];
    const axisPrefix = '$';

    chart
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + 55 + ')')
      .call(
        d3
          .axisBottom(xScale)
          .ticks(3)
          .tickSize(295)
          .tickFormat(this.formatDynamicAbbreviation(numberOfTicks, highestTickValue, axisPrefix))
      )
      .call(g => g.select('.domain').remove());

    d3.selectAll('.tick')
      .selectAll('line')
      .attr('stroke', '#B3BABC')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7);

    d3.selectAll('.tick')
      .selectAll('text')
      .attr('y', '305')
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .attr('font-family', 'UHCSans-Regular')
      .attr('font-weight', '600');

    d3.selectAll('.tick')
      .selectAll('line')
      .filter(function(d) {
        return d === 0;
      })
      .remove();

    // these rect widths shouldnt be hard coded
    chart
      .append('rect')
      .attr('x', 400)
      .attr('y', 70)
      .attr('width', 500)
      .attr('height', 48)
      .attr('fill', '#3381FF');

    chart
      .append('rect')
      .attr('x', 400)
      .attr('y', 150)
      .attr('width', 400)
      .attr('height', 48)
      .attr('fill', '#3381FF');

    chart
      .append('rect')
      .attr('x', 400)
      .attr('y', 200)
      .attr('width', 100)
      .attr('height', 48)
      .attr('fill', '#FC6431');

    chart
      .append('rect')
      .attr('x', 400)
      .attr('y', 280)
      .attr('width', 305)
      .attr('height', 48)
      .attr('fill', '#3381FF');
  }
}
