import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { CommonUtilsService } from '../../../shared/common-utils.service';

@Component({
  selector: 'app-claims-paid-bar-graph',
  templateUrl: './claims-paid-bar-graph.component.html',
  styleUrls: ['./claims-paid-bar-graph.component.scss']
})
export class ClaimsPaidBarGraphComponent implements OnInit, AfterViewInit, OnChanges {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  @Input() chartOptions: any = {};
  initialized: any;
  public testID = 'claimsPaidBreakDown';

  constructor(private common: CommonUtilsService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doBarGraph(this.chartOptions.chartData, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.testID;
    this.initialized = true;
  }

  ngAfterViewInit() {
    this.doBarGraph(this.chartOptions.chartData, this.transition);
  }

  ngOnChanges() {
    if (this.initialized) {
      this.doBarGraph(this.chartOptions.chartData, this.transition);
    }
  }

  nFormatter(fnumber) {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (fnumber < 1000) {
      return fnumber.toFixed(2).replace(/\.0$/, '');
    }
    return fnumber;
  }

  /*
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
    } else if ([3, 6, 5, 9, 12].indexOf(maxTickValueStringLength) > -1) {
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
  */
  findGreatest(inputOne, inputTwo, inputThree, inputFour) {
    let valOne = 0;
    let valTwo = 0;
    if (inputOne > inputTwo) {
      valOne = inputOne;
    } else {
      valOne = inputTwo;
    }

    if (inputThree > inputFour) {
      valTwo = inputThree;
    } else {
      valTwo = inputFour;
    }

    if (valOne > valTwo) {
      return valOne;
    } else {
      return valTwo;
    }
  }
  doBarGraph(chartOptions: any, transition: number) {
    // might have to hard code class names for testing
    const className = 'claims-paid-content'; // 'card-inner-large'
    // this.chartOptions.gdata[0]
    //
    const preWidth = document.getElementsByClassName(className)[0].clientWidth;
    const preHeight = document.getElementsByClassName(className)[0].clientHeight;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    // make sure to verify height if something looks off
    const margin = { top: 10, right: 10, bottom: 10, left: 0 };
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
      .attr('x', 32)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Total Billed');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 100)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[0]));

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 180)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Actual Allowed †');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 180)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[1]));

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 230)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Estimated Non-Payment');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 230)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[2]));

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 310)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Total Paid By UHC');

    chart
      .append('text')
      .attr('x', 370)
      .attr('y', 310)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[3]));

    chart
      .append('text')
      .attr('x', 900)
      .attr('y', 30)
      .attr('fill', '#2D2D39')
      .attr('font-size', '12')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('† Includes Member Responsibility');

    chart
      .append('line')
      .attr('x1', 400)
      .attr('y1', 55)
      .attr('x2', 400)
      .attr('y2', 350)
      .attr('stroke', '#757588')
      .attr('stroke-width', '1px');

    const highestValue = this.findGreatest(
      this.chartOptions.chartData[0],
      this.chartOptions.chartData[1],
      this.chartOptions.chartData[2],
      this.chartOptions.chartData[3]
    );
    // const highestValue = 800;
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
          .tickSize(5, 0, 0)
        // .tickSizeOuter([0])
      );

    /*
    const preArray = d3
      .select('#forCalculations')
      .selectAll('.tick>text')
      .nodes()
      .map(function(t) {
        const tagString = new XMLSerializer().serializeToString(t);
        const mySubString = tagString.substring(tagString.indexOf('>') + 1, tagString.indexOf('</'));
        return mySubString;
      });

    d3.select('#forCalculations').remove();

    for (let i = 0; i < preArray.length; i++) {
      preArray[i] = preArray[i].replace(/,/g, '');
    }
    */
    // const preArrayOfNumbers = preArray.map(Number);
    // const numberOfTicks = preArrayOfNumbers.length;
    const highestTickValue = highestValue;
    const axisPrefix = '$';

    const xScaleBar = d3
      .scaleLinear()
      .domain([0, highestTickValue])
      .range([0, 500]);

    const f = d3.format('$.1s');
    f(1e9).replace(/G/, 'B');

    chart
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + 55 + ')')
      .call(
        d3
          .axisBottom(xScale)
          .ticks(3)
          .tickSize(295)
          // .tickFormat(this.formatDynamicAbbreviation(numberOfTicks, highestTickValue, axisPrefix))
          .tickFormat(f)
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
      .attr('font-size', '14')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'");

    d3.selectAll('.tick')
      .selectAll('line')
      .filter(function(d) {
        return d === 0;
      })
      .remove();

    if (
      this.chartOptions.chartData[0] === 0 &&
      this.chartOptions.chartData[1] === 0 &&
      this.chartOptions.chartData[2] === 0 &&
      this.chartOptions.chartData[3] === 0
    ) {
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 70)
        .attr('width', this.chartOptions.chartData[0])
        .attr('height', 48)
        .attr('fill', '#3381FF');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 150)
        .attr('width', this.chartOptions.chartData[1])
        .attr('height', 48)
        .attr('fill', '#3381FF');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 200)
        .attr('width', this.chartOptions.chartData[2])
        .attr('height', 48)
        .attr('fill', '#FC6431');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 280)
        .attr('width', this.chartOptions.chartData[3])
        .attr('height', 48)
        .attr('fill', '#3381FF');
    } else {
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 70)
        .attr('width', xScaleBar(this.chartOptions.chartData[0]))
        .attr('height', 48)
        .attr('fill', '#3381FF');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 150)
        .attr('width', xScaleBar(this.chartOptions.chartData[1]))
        .attr('height', 48)
        .attr('fill', '#3381FF');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 200)
        .attr('width', xScaleBar(this.chartOptions.chartData[2]))
        .attr('height', 48)
        .attr('fill', '#FC6431');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 280)
        .attr('width', xScaleBar(this.chartOptions.chartData[3]))
        .attr('height', 48)
        .attr('fill', '#3381FF');
    }
  }
}
