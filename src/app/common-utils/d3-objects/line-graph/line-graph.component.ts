import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation, HostBinding } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class LineGraphComponent implements OnInit {
  public width: any;
  public height: any;
  public renderChart: string;
  public dataOne: any = [];
  public titleDataOne: any = [];
  public temp: any;
  public selectYear;
  public count = 1;
  @Input() printStyle;
  @Input() yearComparison;
  @Input() chartOptions: any = {};
  @Input() tooltipBool;
  @Input() _changeTimeFrame: string;
  @Input() denialLineGraph;
  set changeTimeFrame(value: string) {
    this.selectYear = value;
    if (this.count !== 1) {
      this.onSystemChange();
    } else {
      this.count = 0;
    }
  }

  get changeTimeFrame(): string {
    return this._changeTimeFrame;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('line graph', this.chartOptions.chartId);
    this.renderChart = '#' + this.chartOptions.chartId;

    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.doLineGraph(
      this.chartOptions.chartData,
      this.chartOptions.chartData2,
      this.chartOptions.titleData,
      this.chartOptions.generalData,
      this.chartOptions.generalData2
    );
  }

  onResize(event) {
    this.doLineGraph(
      this.chartOptions.chartData,
      this.chartOptions.chartData2,
      this.chartOptions.titleData,
      this.chartOptions.generalData,
      this.chartOptions.generalData2
    );
  }

  onSystemChange() {
    this.doLineGraph(
      this.chartOptions.chartData,
      this.chartOptions.chartData2,
      this.chartOptions.titleData,
      this.chartOptions.generalData,
      this.chartOptions.generalData2
    );
  }

  doLineGraph(chartData: any, chartData2: any, titleData: any, generalData: any, generalData2: any) {
    function formatDy(dy: number): string {
      if (dy === 0) {
        return '0';
      } else if (dy < 999) {
        return dy.toFixed(0);
      } else if (dy < 999999) {
        return (dy / 1000).toFixed(1) + 'K';
      } else if (dy) {
        return (dy / 1000000).toFixed(1) + 'M';
      }
    }

    function formatDynamicAbbreviation(tickNumber, tickValue, prefix) {
      const q = tickValue;
      const w = tickNumber - 1;
      const step = q / w;
      let zeroOrOne = 0;
      let abbreviation = 0;

      const maxTickValueStringLength = q.toString().length;
      const stepStringLength = step.toString().length;

      if (maxTickValueStringLength === stepStringLength) {
        zeroOrOne = 0;
      } else if (maxTickValueStringLength % 3 === 0) {
        zeroOrOne = 0;
      } else if (maxTickValueStringLength === 5 && stepStringLength === 4) {
        zeroOrOne = 0;
      } else {
        zeroOrOne = 1;
      }

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
    } // ends formatDynamicAbbrevia function

    function tooltipTextOnPrint(d, year, prefix) {
      if (year == undefined || !year || year === '') {
        return '(' + prefix + formatDy(d.y) + ')';
      }
    }

    const preWidth = generalData[0].width || 961; // document.getElementById(generalData[0].parentDiv).clientWidth;

    let topMarginSubtract = 150;
    if (titleData[0].topTitleBoxNumber) {
      topMarginSubtract = 0;
    }
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 85 - topMarginSubtract, right: 62, bottom: 85, left: 48 };
    const width = preWidth - margin.left - margin.right;
    const height = 520 - margin.top - margin.bottom + 8;

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', 420 /*height - margin.top - margin.bottom*/)
      .style('background-color', generalData[0].backgroundColor)
      .append('g')
      .attr('transform', 'translate(' + (margin.left - 7) + ',' + 5 + ')');

    const shiftTooltip = -130;

    if (generalData[0].tooltipBoolean === true) {
      // tslint:disable-next-line:no-var-keyword
      var tooltipVar = d3
        .select(this.renderChart)
        .append('div')
        .classed('tooltipBlockClass', true)
        .classed('tooltipClass', false)
        .classed('tooltipClassLeft', false)
        .classed('hidden', true);
      tooltipVar
        .append('div')
        .attr('class', 'lineLabelHover')
        .attr('id', 'claimsNotPaidLabelOne')
        .text('Claims Not');
      tooltipVar
        .append('div')
        .attr('class', 'lineLabelHover')
        .attr('id', 'claimsNotPaidLabelTwo')
        .text('Paid');
      tooltipVar
        .append('div')
        .attr('class', 'details-label')
        .attr('id', 'claimsNotPaidLabelThree');
      // .text('$' + formatDy(d.y));
    } else {
      tooltipVar = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'displayNone');
    }

    const lengthOfData = chartData.length;
    // tslint:disable-next-line:no-var-keyword
    var highestValue = Math.max.apply(
      Math,
      chartData.map(function(o) {
        return o.value;
      })
    );
    // tslint:disable-next-line:no-var-keyword
    const highestValue2 = Math.max.apply(
      Math,
      chartData2.map(function(o) {
        return o.value;
      })
    );
    let axisPrefix = '';

    if (highestValue !== 0) {
      axisPrefix = '$';
    } else {
      axisPrefix = '';
    }

    if (highestValue < highestValue2) {
      highestValue = highestValue2;
    }

    const xScale = d3
      .scaleLinear()
      .domain([0, lengthOfData - 1]) // input
      .range([25, width - 25]);

    const xScalePath = d3
      .scaleLinear()
      .domain([0, 2]) // input
      .range([0, width]);

    const xScale3 = d3
      .scalePoint()
      .domain(
        chartData.map(function(d) {
          return d.name;
        })
      ) // input
      .range([25, width - 25]);

    const yScale = d3
      .scaleLinear()
      .domain([0, highestValue]) // input
      .range([350, 0])
      .nice(3); // output

    // tslint:disable-next-line:no-var-keyword

    // tslint:disable-next-line:no-var-keyword
    const ydata = [];

    for (let a = 0; a < lengthOfData; a++) {
      ydata.push({ y: chartData[a].value });
    }

    chart
      .append('g')
      .attr('class', 'tick_hidden')
      .attr('id', 'forCalculation')
      .attr('transform', 'translate(0,' + 360 /*(height - 60)*/ + ')')
      .call(
        d3
          .axisBottom(xScale3)
          .tickSize(5, 0, 0)
          .tickSizeOuter([0])
      );

    chart
      .append('text')
      .attr('id', 'forlolCalculations')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .attr('font-size', '14px')
      .text(chartData.name)
      .style('fill', '#2D2D39');

    const text_element1 = chart.select('#forlolCalculations');
    // tslint:disable-next-line:no-var-keyword
    var textWidth1 = text_element1.node().getComputedTextLength();

    chart.select('#forlolCalculations').remove();
    if (chartData.length === 4) {
      textWidth1 = textWidth1 / 2;
    } else if (chartData.length === 3) {
      textWidth1 = textWidth1 * 1.25;
    }

    // tslint:disable-next-line:prefer-const
    let data = [];
    for (let l = 0; l < lengthOfData; l++) {
      data.push({ y: chartData[l].value, xCoordinate: xScale(l), x: chartData[l].name });
    }
    const line = d3
      .line()
      .x(function(d) {
        return d.xCoordinate;
      })
      .y(function(d) {
        return yScale(d.y);
      })
      .curve(d3.curveLinear);

    chart
      .append('g')
      .attr('visibility', 'hidden')
      .attr('id', 'forYCalculations')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(5, 0, 0)
          .tickSizeOuter([0])
          .ticks(3)
      );

    const preYArray = d3
      .select('#forYCalculations')
      .selectAll('.tick>text')
      .nodes()
      .map(function(t) {
        const tagString = new XMLSerializer().serializeToString(t);
        const mySubString = tagString.substring(tagString.indexOf('>') + 1, tagString.indexOf('</'));
        return mySubString;
      });

    d3.select('#forYCalculations').remove();
    for (let y = 0; y < preYArray.length; y++) {
      preYArray[y] = preYArray[y].replace(/,/g, '');
    }

    const preArrayOfNumbers = preYArray.map(Number);
    const numberOfTicks = preArrayOfNumbers.length;
    const highestTickValue = preArrayOfNumbers[numberOfTicks - 1];

    chart
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(3)
          .tickSize(-width, 0, 0)
          .tickFormat('')
          .tickSizeOuter([0])
      );

    chart.selectAll('.tick:not(:first-of-type) line').attr('opacity', '.35');
    chart.selectAll('.tick:first-of-type line').attr('opacity', '1');

    if (1) {
      if (!generalData[0].hideYAxis) {
        chart
          .append('g')
          .attr('class', 'tick_hidden_y')
          .attr('transform', 'translate( ' + width + ', 0 )')
          .call(
            d3
              .axisRight(yScale)
              .tickSize(5, 0, 0)
              .tickSizeOuter([0])
              .ticks(3)
              .tickFormat(formatDynamicAbbreviation(numberOfTicks, highestTickValue, axisPrefix))
          );
      }
    }
    const RectBarOne = chart
      .selectAll('.rect-bar')
      .data(data)
      .enter()
      .append('rect')
      .style('fill', '#E3F0FD')
      .style('opacity', 0)
      .attr('class', 'rect-bar')
      .attr('x', function(d) {
        return d.xCoordinate - 22;
      })
      .attr('id', function(d) {
        return 'rect-id-' + d.x;
      })
      .attr('y', 0)
      .on('mouseover', d => {
        const RectBar = chart.selectAll('#rect-id-' + d.x);
        RectBar.transition()
          .duration(200)
          .style('opacity', 1)
          .style('cursor', 'pointer');
        const RectBarDot = chart.selectAll('#dot-id-' + d.x);
        RectBarDot.transition()
          .duration(200)
          .style('opacity', 1);
        tooltipVar
          .transition()
          .duration(200)
          .style('opacity', 1);
        const topMar = yScale(d.y) + 39 + 'px';
        if (d3.event.layerX + 213 < width + margin.left + margin.right) {
          d3.select('#claimsNotPaidLabelThree').text('$' + formatDy(d.y));
          tooltipVar
            .classed('hidden', false)
            .classed('tooltipClass', true)
            .classed('tooltipClassLeft', false)
            .style('left', d.xCoordinate + 56 + 'px')
            .style('top', topMar);
        } else {
          d3.select('#claimsNotPaidLabelThree').text('$' + formatDy(d.y));
          tooltipVar
            .classed('hidden', false)
            .classed('tooltipClass', false)
            .classed('tooltipClassLeft', true)
            .style('left', d.xCoordinate + 56 + shiftTooltip + 'px')
            .style('top', topMar);
        }
      })
      .on('mouseout', function(d) {
        const RectBar = chart.selectAll('#rect-id-' + d.x);
        RectBar.transition()
          .duration(200)
          .style('opacity', 0);
        const RectBarDot = chart.selectAll('#dot-id-' + d.x);
        RectBarDot.transition()
          .duration(200)
          .style('opacity', 0);
        tooltipVar
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    if (this.printStyle) {
      // const tooltipVar1 = d3
      //   .select(this.renderChart)
      //   .append('div')
      //   .classed('tooltipClassPrint', true)
      //   .classed('hidden', true);
      chart
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle') // Uses the enter().append() method
        .attr('class', 'dot') // Assign a class for styling
        .attr('cx', function(d, i) {
          return xScale(i);
        })
        .attr('cy', function(d) {
          // const topMar = yScale(d.y) + 49 + 'px';
          // tooltipVar1
          //   .html(tooltipTextOnPrint(d, this.yearComparison, axisPrefix))
          //   .classed('hidden', false)
          //   .style('left', d.xCoordinate + 46 + 'px')
          //   .style('top', topMar);
          return yScale(d.y);
        })
        .attr('r', 5);

      chart
        .selectAll('.text')
        .data(data)
        .enter()
        .append('text')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .attr('font-size', '14px')
        .text(function(d) {
          return tooltipTextOnPrint(d, this.yearComparison, axisPrefix);
        })
        .attr('x', function(d, i) {
          return xScale(i);
        })
        .attr('y', function(d, i) {
          return yScale(d.y);
        })
        .attr('transform', 'translate(-12, -15)');
    }

    const DotOne = chart
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .style('fill', '#3381FF')
      .style('opacity', 0)
      .attr('class', 'dot')
      .attr('id', function(d) {
        return 'dot-id-' + d.x;
      })
      .attr('cx', function(d) {
        return d.xCoordinate;
      })
      .attr('cy', function(d) {
        return yScale(d.y);
      })
      .attr('r', 6);

    if (1) {
      chart
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .attr('id', 'LineOne')
        .style('fill', 'none')
        .style('stroke', generalData[0].barColor);
    }

    // end if structure o titleData[0].averagePeerPerformance
  } // end dolineGraph Function
} // export class ends here
