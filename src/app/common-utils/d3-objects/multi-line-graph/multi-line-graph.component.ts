import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-multi-line-graph',
  templateUrl: './multi-line-graph.component.html',
  styleUrls: ['./multi-line-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MultiLineGraphComponent implements OnInit {
  public width: any;
  public height: any;
  public renderChart: string;
  public dataOne: any = [];
  public titleDataOne: any = [];
  public temp: any;
  public selectYear;
  public count = 1;
  public monthlyData = [];
  public monthValue;
  public yCoordinates: any = [];
  public y1;
  public y2;
  public y3;
  public y4;

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

  constructor() {}

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.chartId;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.doLineGraph(
      this.chartOptions.lineOne.chartData,
      this.chartOptions.lineTwo.chartData,
      this.chartOptions.lineThree.chartData,
      this.chartOptions.lineFour.chartData,
      this.chartOptions.titleData,
      this.chartOptions.lineOne.generalData,
      this.chartOptions.lineTwo.generalData
    );
  }

  onResize(event) {
    this.doLineGraph(
      this.chartOptions.lineOne.chartData,
      this.chartOptions.lineTwo.chartData,
      this.chartOptions.lineThree.chartData,
      this.chartOptions.lineFour.chartData,
      this.chartOptions.titleData,
      this.chartOptions.lineOne.generalData,
      this.chartOptions.lineTwo.generalData
    );
  }

  onSystemChange() {
    this.doLineGraph(
      this.chartOptions.lineOne.chartData,
      this.chartOptions.lineTwo.chartData,
      this.chartOptions.lineThree.chartData,
      this.chartOptions.lineFour.chartData,
      this.chartOptions.titleData,
      this.chartOptions.lineOne.generalData,
      this.chartOptions.lineTwo.generalData
    );
  }

  doLineGraph(
    chartData: any,
    chartData1: any,
    chartData2: any,
    chartData3: any,
    titleData: any,
    generalData: any,
    generalData2: any
  ) {
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

    function tooltipText(monthValue, y1, y2, y3, y4) {
      return `<div class="lineLabelHover">
          ${monthValue ? `<p class="month-value">${monthValue}</p>` : ''}
          ${y1 != null ? `<p><div class="tooltip-mr-img"></div> M&R : ${y1}</p>` : ''}
          ${y2 != null ? `<p><div class="tooltip-cs-img"></div> C&S : ${y2}</p>` : ''}
          ${y3 != null ? `<p><div class="tooltip-ei-img"></div> E&I : ${y3}</p>` : ''}
          ${y4 != null ? `<p><div class="tooltip-other-img"></div> Other : ${y4}</p>` : ''}
        </div>`;
    }

    const preWidth = 621; // document.getElementById(generalData.parentDiv).clientWidth;

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
      .attr('height', 250 /*height - margin.top - margin.bottom*/)
      .style('background-color', generalData.backgroundColor)
      .append('g')
      .attr('transform', 'translate(' + (margin.left - 7) + ',' + 5 + ')');
    const div = d3
      .select(this.renderChart)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const shiftTooltip = 85;

    if (generalData.tooltipBoolean === true) {
      // tslint:disable-next-line:no-var-keyword
      var tooltipVar = d3
        .select(this.renderChart)
        .append('div')
        .classed('tooltipBlockClass', true)
        .classed('tooltipClass', false)
        .classed('tooltipClassLeft', false)
        .classed('hidden', true);
    } else {
      tooltipVar = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'displayNone');
    }

    let highestValue = Math.max.apply(
      Math,
      chartData.map(function(o) {
        return o.value;
      })
    );
    const highestValue1 = Math.max.apply(
      Math,
      chartData1.map(function(o) {
        return o.value;
      })
    );
    const highestValue2 = Math.max.apply(
      Math,
      chartData2.map(function(o) {
        return o.value;
      })
    );
    const highestValue3 = Math.max.apply(
      Math,
      chartData3.map(function(o) {
        return o.value;
      })
    );
    let axisPrefix = '';
    if (highestValue !== 0) {
      axisPrefix = '';
    }
    const highestValueArray = [highestValue, highestValue1, highestValue2, highestValue3];
    highestValue = Math.max.apply(
      Math,
      highestValueArray.map(function(o) {
        return o;
      })
    );

    const lengthOfData = chartData.length;
    const lengthOfData1 = chartData1.length;
    const lengthOfData2 = chartData2.length;
    const lengthOfData3 = chartData3.length;
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
      .range([180, 0])
      .nice(3); // output

    // const ydata = [];
    //
    // for (let a = 0; a < lengthOfData; a++) {
    //   ydata.push({ y: chartData[a].value });
    // }

    chart
      .append('g')
      .attr('class', 'tick_hidden')
      .attr('id', 'forCalculation')
      .attr('transform', 'translate(0,' + 200 /*(height - 60)*/ + ')')
      .call(
        d3
          .axisBottom(xScale3)
          .tickSize(0, 0, 0)
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
      data.push({ y: chartData[l].value, xCoordinate: xScale(l), x: chartData[l].name });
    }
    const data1 = [];
    for (let l = 0; l < lengthOfData1; l++) {
      data1.push({ y: chartData1[l].value, xCoordinate: xScale(l), x: chartData1[l].name });
    }
    const data2 = [];
    for (let l = 0; l < lengthOfData2; l++) {
      data2.push({ y: chartData2[l].value, xCoordinate: xScale(l), x: chartData2[l].name });
    }
    const data3 = [];
    for (let l = 0; l < lengthOfData3; l++) {
      data3.push({ y: chartData3[l].value, xCoordinate: xScale(l), x: chartData3[l].name });
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
      if (!generalData.hideYAxis) {
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
      .selectAll('.multi-line-rect-bar')
      .data(data)
      .enter()
      .append('rect')
      .style('fill', '#E3F0FD')
      .style('opacity', 0)
      .attr('class', 'multi-line-rect-bar')
      .attr('x', function(d) {
        return d.xCoordinate - 22;
      })
      .attr('id', function(d) {
        return 'rect-id-' + d.x.replace(/\s/g, '');
      })
      .attr('y', 0)
      .on('mouseover', d => {
        const RectBarId = 'rect-id-' + d.x.replace(/\s/g, ''),
          RectBar = chart.selectAll(`rect[id=${RectBarId}]`),
          DotId1 = 'dot-id1-' + d.x.replace(/\s/g, ''),
          DotId2 = 'dot-id2-' + d.x.replace(/\s/g, ''),
          DotId3 = 'dot-id3-' + d.x.replace(/\s/g, ''),
          DotId4 = 'dot-id4-' + d.x.replace(/\s/g, ''),
          RectBarDot1 = chart.selectAll(`circle[id=${DotId1}]`),
          RectBarDot2 = chart.selectAll(`circle[id=${DotId2}]`),
          RectBarDot3 = chart.selectAll(`circle[id=${DotId3}]`),
          RectBarDot4 = chart.selectAll(`circle[id=${DotId4}]`);
        RectBar.transition()
          .duration(200)
          .style('opacity', 1)
          .style('cursor', 'pointer');
        [RectBarDot1, RectBarDot2, RectBarDot3, RectBarDot4].forEach(dot => {
          dot
            .transition()
            .duration(200)
            .style('opacity', 1);
        });

        tooltipVar
          .transition()
          .duration(200)
          .style('opacity', 1);
        const topMar = yScale(d.y) + 39 + 'px';
        this.monthValue = d.x.replace(/\s/g, '');
        if (data.length > 0) {
          data.forEach(value => {
            if (value.x.replace(/\s/g, '') === this.monthValue) {
              this.yCoordinates[0] = value.y;
            }
          });
        }
        if (data1.length > 0) {
          data1.forEach(value => {
            if (value.x.replace(/\s/g, '') === this.monthValue) {
              this.yCoordinates[1] = value.y;
            }
          });
        }
        if (data2.length > 0) {
          data2.forEach(value => {
            if (value.x.replace(/\s/g, '') === this.monthValue) {
              this.yCoordinates[2] = value.y;
            }
          });
        }
        if (data3.length > 0) {
          data3.forEach(value => {
            if (value.x.replace(/\s/g, '') === this.monthValue) {
              this.yCoordinates[3] = value.y;
            }
          });
        }
        if (d3.event.layerX + 213 < width + margin.left + margin.right) {
          tooltipVar
            .html(
              tooltipText(
                this.monthValue,
                this.yCoordinates[0],
                this.yCoordinates[1],
                this.yCoordinates[2],
                this.yCoordinates[3]
              )
            )
            .classed('hidden', false)
            .classed('tooltip-class', true)
            .classed('tooltip-class-left', false)
            .style('left', d.xCoordinate + 265 + 'px')
            .style('top', topMar);
        } else {
          tooltipVar
            .html(
              tooltipText(
                this.monthValue,
                this.yCoordinates[0],
                this.yCoordinates[1],
                this.yCoordinates[2],
                this.yCoordinates[3]
              )
            )
            .classed('hidden', false)
            .classed('tooltip-class', false)
            .classed('tooltip-class-left', true)
            .style('left', d.xCoordinate + 5 + shiftTooltip + 'px')
            .style('top', topMar);
        }
      })
      .on('mouseout', function(d) {
        const RectBarId = 'rect-id-' + d.x.replace(/\s/g, ''),
          RectBar = chart.selectAll(`rect[id=${RectBarId}]`),
          DotId1 = 'dot-id1-' + d.x.replace(/\s/g, ''),
          DotId2 = 'dot-id2-' + d.x.replace(/\s/g, ''),
          DotId3 = 'dot-id3-' + d.x.replace(/\s/g, ''),
          DotId4 = 'dot-id4-' + d.x.replace(/\s/g, ''),
          RectBarDot1 = chart.selectAll(`circle[id=${DotId1}]`),
          RectBarDot2 = chart.selectAll(`circle[id=${DotId2}]`),
          RectBarDot3 = chart.selectAll(`circle[id=${DotId3}]`),
          RectBarDot4 = chart.selectAll(`circle[id=${DotId4}]`);
        RectBar.transition()
          .duration(200)
          .style('opacity', 0)
          .style('cursor', 'pointer');
        [RectBarDot1, RectBarDot2, RectBarDot3, RectBarDot4].forEach(dot => {
          dot
            .transition()
            .duration(200)
            .style('opacity', 0);
        });
        tooltipVar
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    const DotOne = chart
      .selectAll('.multi-line-dot1')
      .data(data)
      .enter()
      .append('circle')
      .style('fill', this.chartOptions.lineOne.generalData.barColor)
      .style('opacity', 0)
      .attr('class', 'multi-line-dot1')
      .attr('id', function(d) {
        return 'dot-id1-' + d.x.replace(/\s/g, '');
      })
      .attr('cx', function(d) {
        return d.xCoordinate;
      })
      .attr('cy', function(d) {
        return yScale(d.y);
      })
      .attr('r', 6);

    const DotTwo = chart
      .selectAll('.multi-line-dot2')
      .data(data1)
      .enter()
      .append('circle')
      .style('fill', this.chartOptions.lineTwo.generalData.barColor)
      .style('opacity', 0)
      .attr('class', 'multi-line-dot2')
      .attr('id', function(d) {
        return 'dot-id2-' + d.x.replace(/\s/g, '');
      })
      .attr('cx', function(d) {
        return d.xCoordinate;
      })
      .attr('cy', function(d) {
        return yScale(d.y);
      })
      .attr('r', 6);

    const DotThree = chart
      .selectAll('.multi-line-dot3')
      .data(data2)
      .enter()
      .append('circle')
      .style('fill', this.chartOptions.lineThree.generalData.barColor)
      .style('opacity', 0)
      .attr('class', 'multi-line-dot3')
      .attr('id', function(d) {
        return 'dot-id3-' + d.x.replace(/\s/g, '');
      })
      .attr('cx', function(d) {
        return d.xCoordinate;
      })
      .attr('cy', function(d) {
        return yScale(d.y);
      })
      .attr('r', 6);

    const DotFour = chart
      .selectAll('.multi-line-dot4')
      .data(data3)
      .enter()
      .append('circle')
      .style('fill', this.chartOptions.lineFour.generalData.barColor)
      .style('opacity', 0)
      .attr('class', 'multi-line-dot4')
      .attr('id', function(d) {
        return 'dot-id4-' + d.x.replace(/\s/g, '');
      })
      .attr('cx', function(d) {
        return d.xCoordinate;
      })
      .attr('cy', function(d) {
        return yScale(d.y);
      })
      .attr('r', 6);

    // Dark line
    if (this.chartOptions.lineOne.chartData != undefined && this.chartOptions.lineOne.chartData.length > 0) {
      chart
        .append('path')
        .datum(data)
        .attr('class', 'multi-line')
        .attr('d', line)
        .attr('id', 'LineOne')
        .style('fill', 'none')
        .style('stroke', this.chartOptions.lineOne.generalData.barColor)
        .style('stroke-width', '4');
    }
    // Dotted line
    if (this.chartOptions.lineTwo.chartData != undefined && this.chartOptions.lineTwo.chartData.length > 0) {
      chart
        .append('path')
        .datum(data1)
        .attr('class', 'multi-line2')
        .attr('d', line)
        .attr('id', 'LineTwo')
        .style('fill', 'none')
        .style('stroke', this.chartOptions.lineTwo.generalData.barColor)
        .style('stroke-dasharray', '4, 3')
        .style('stroke-width', '3');
    }
    // Line
    if (this.chartOptions.lineThree.chartData != undefined && this.chartOptions.lineThree.chartData.length > 0) {
      chart
        .append('path')
        .datum(data2)
        .attr('class', 'multi-line3')
        .attr('d', line)
        .attr('id', 'LineThree')
        .style('fill', 'none')
        .style('stroke', this.chartOptions.lineThree.generalData.barColor)
        .style('stroke-width', '2');
    }
    // Dashed line
    if (this.chartOptions.lineFour.chartData != undefined && this.chartOptions.lineFour.chartData.length > 0) {
      chart
        .append('path')
        .datum(data3)
        .attr('class', 'multi-line4')
        .attr('d', line)
        .attr('id', 'LineFour')
        .style('fill', 'none')
        .style('stroke', this.chartOptions.lineFour.generalData.barColor)
        .style('stroke-dasharray', '7, 7')
        .style('stroke-width', '2');
    }
  } // end dolineGraph Function
} // export class ends here
