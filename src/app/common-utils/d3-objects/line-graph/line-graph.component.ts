import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
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
      this.chartOptions.generalData
    );
  }

  onResize(_event) {
    this.doLineGraph(
      this.chartOptions.chartData,
      this.chartOptions.chartData2,
      this.chartOptions.titleData,
      this.chartOptions.generalData
    );
  }

  onSystemChange() {
    this.doLineGraph(
      this.chartOptions.chartData,
      this.chartOptions.chartData2,
      this.chartOptions.titleData,
      this.chartOptions.generalData
    );
  }

  doLineGraph(chartData: any, chartData2: any, titleData: any, generalData: any) {
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

    const lengthOfData = chartData.length;
    const marginRight = generalData[0].marginRight >= 0 ? generalData[0].marginRight : 62;
    const marginLeft = generalData[0].marginLeft >= 0 ? generalData[0].marginLeft : 48;

    const margin = { top: 85 - topMarginSubtract, right: marginRight, bottom: 85, left: marginLeft };
    const width = preWidth - margin.left - margin.right;
    const height = generalData[0].height || 420;
    const hoverMargin = generalData[0].hoverMargin || 56;
    const dupDelimiter = generalData[0].dupDelimiter;
    const xPartWidth = width / (lengthOfData - 1);

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .style('background-color', generalData[0].backgroundColor)
      .append('g')
      .attr('transform', 'translate(' + (margin.left - 7) + ',' + 5 + ')');

    const shiftTooltip = -130;

    if (generalData[0].tooltipBoolean === true) {
      if (generalData[0].tooltipType === 'nps') {
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
          .attr('class', 'lineLabelHoverNps')
          .attr('id', 'npsLabelOne');
        tooltipVar
          .append('div')
          .attr('class', 'lineLabelHoverNps')
          .attr('id', 'npsLabelTwo');
      } else {
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
      }
    } else {
      tooltipVar = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'displayNone');
    }

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

    if (generalData[0].yAxisUnits) {
      axisPrefix = generalData[0].yAxisUnits;
    }

    if (highestValue < highestValue2) {
      highestValue = highestValue2;
    }

    const xScale = d3
      .scaleLinear()
      .domain([0, lengthOfData - 1]) // input
      .range([25, width - 25]);

    const xScalePath = (index: number, key: number, total: number) => {
      if ((index + 1) % key === 0 && total !== index + 1) {
        return xPartWidth * (index + 1);
      }
      return xPartWidth * index;
    };

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
      .range([height - 70, 0])
      .nice(5); // output

    // tslint:disable-next-line:no-var-keyword

    // tslint:disable-next-line:no-var-keyword
    const ydata = [];

    for (let a = 0; a < lengthOfData; a++) {
      ydata.push({ y: chartData[a].value });
    }

    let xtextClass = 'tick_hidden';
    let ytextClass = 'tick_hidden_y';
    if (generalData[0].customTextClass) {
      xtextClass = 'tick_hidden_y_custom';
      ytextClass = 'tick_hidden_custom';
    }

    chart
      .append('g')
      .attr('class', ytextClass)
      .attr('id', 'forCalculation')
      .attr('transform', 'translate(0,' + (height - 60) + ')')
      .call(
        d3
          .axisBottom(xScale3)
          .tickFormat(d => {
            // If X Axis has duplicate values / Formatted Values, Pass respective keys in generalData object and
            // and use accordingly
            if (generalData[0].formattedXAxis) {
              const preDelimiterLength = 2;
              const delimiterForDuplicate = d.substring(d.length - dupDelimiter.length - preDelimiterLength, d.length);
              if (delimiterForDuplicate.substring(preDelimiterLength, delimiterForDuplicate.length) === dupDelimiter) {
                let formattedString = d.replace(dupDelimiter, '');
                formattedString = formattedString.substring(0, formattedString.length - preDelimiterLength);
                return formattedString.replace('_', ' ');
              }
            }
            return d;
          })
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

    const data = [];
    for (let l = 0; l < lengthOfData; l++) {
      data.push({
        y: chartData[l].value,
        yAndQ: chartData[l].quarter + ' ' + chartData[l].year,
        targetY: chartData[l].target,
        targetX: xScalePath(l, 4, lengthOfData),
        xCoordinate: xScale(l),
        x: chartData[l].name
      });
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

    const line2 = d3
      .line()
      .x(function(d) {
        return d.targetX;
      })
      .y(function(d) {
        return yScale(d.targetY);
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

    if (!generalData[0].hideYAxis) {
      chart
        .append('g')
        .attr('class', xtextClass)
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
    // const RectBarOne = chart
    chart
      .selectAll('.rect-bar')
      .data(data)
      .enter()
      .append('rect')
      .style('fill', '#E3F0FD')
      .style('height', height - 70 + 'px')
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
        if (d3.event.offsetX + 213 < width + margin.left + margin.right) {
          tooltipVar
            .classed('hidden', false)
            .classed('tooltipClass', true)
            .classed('tooltipClassLeft', false)
            .style('left', d.xCoordinate + hoverMargin + 'px')
            .style('top', topMar);
        } else {
          tooltipVar
            .classed('hidden', false)
            .classed('tooltipClass', false)
            .classed('tooltipClassLeft', true)
            .style('left', d.xCoordinate + hoverMargin + shiftTooltip + 'px')
            .style('top', topMar);
        }

        if (generalData[0].tooltipType === 'nps') {
          d3.select('#npsLabelOne').text(d.yAndQ);
          d3.select('#npsLabelTwo')
            .selectAll('*')
            .remove();
          const dotMagnitude = 12;
          d3.select('#npsLabelTwo')
            .append('svg')
            .attr('width', dotMagnitude)
            .attr('height', dotMagnitude)
            .style('vertical-align', 'middle')
            .append('circle')
            .attr('fill', '#3381ff')
            .attr('cx', dotMagnitude / 2)
            .attr('cy', dotMagnitude / 2)
            .attr('r', dotMagnitude / 2);
          d3.select('#npsLabelTwo')
            .append('text')
            .text(formatDy(d.y));
        } else {
          d3.select('#claimsNotPaidLabelThree').text('$' + formatDy(d.y));
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
        .attr('cx', function(_d, i) {
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
        .attr('x', function(_d, i) {
          return xScale(i);
        })
        .attr('y', function(d) {
          return yScale(d.y);
        })
        .attr('transform', 'translate(-12, -15)');
    }

    // const DotOne = chart
    chart
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

    chart
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)
      .attr('id', 'LineOne')
      .style('fill', 'none')
      .style('stroke', generalData[0].barColor);

    if (generalData[0].trendLine) {
      chart
        .append('path')
        .datum(data)
        .attr('class', 'line2')
        .attr('d', line2)
        .attr('id', 'LineTwo')
        .style('fill', 'none')
        .style('stroke', generalData[0].trendLineColor);
    }

    // end if structure o titleData[0].averagePeerPerformance
  } // end dolineGraph Function
} // export class ends here
