import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';

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

    function tooltipText(d, year, prefix) {
      if (year == undefined || !year || year === '') {
        return (
          "<div class='lineLabelHover'>" +
          "Claims Not <br> Paid</div><div class='details-label'>" +
          prefix +
          formatDy(d.y)
        );
      } else {
        return (
          "<div class='lineLabelHover'>" +
          "&nbsp; Claims Not <br> Paid</div><div class='details-label'>&nbsp;&nbsp;&nbsp;" +
          d.x +
          '&nbsp;&nbsp;' +
          year[0] +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          prefix +
          formatDy(d.y) +
          "<hr class='hr_cust_margin hr_opacity'><span class='circle_label_sm circle2'></span>&nbsp;&nbsp;&nbsp;" +
          d.x +
          '&nbsp;&nbsp;' +
          year[1] +
          '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
          prefix +
          formatDy(d.y_twoYearsAgo) +
          '%</div></div>'
        );
      }
    }
    // function tooltipText2(d, year, prefix) {
    //   return (
    //     "<div class='lineLabelHover'>" +
    //     d.x +
    //     // tslint:disable-next-line:max-line-length
    //     "&nbsp; Trend Details</div><hr class='hr_cust_margin'><div class='details-label'>
    //     <span class='circle_label_sm circle1'></span>&nbsp;&nbsp;&nbsp;" +
    //     d.x +
    //     '&nbsp;&nbsp;' +
    //     year[0] +
    //     '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
    //     prefix +
    //     formatDy(d.y_lastYear) +
    //     "<hr class='hr_cust_margin hr_opacity'><span class='circle_label_sm circle2'></span>&nbsp;&nbsp;&nbsp;" +
    //     d.x +
    //     '&nbsp;&nbsp;' +
    //     year[1] +
    //     '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
    //     prefix +
    //     formatDy(d.y) +
    //     '%</div></div>'
    //   );
    // }

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
    /* const div = d3
      .select(this.renderChart)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);*/

    const shiftTooltip = -130;

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

    if (this.chartOptions.lineTwo.chartData != undefined && this.chartOptions.lineTwo.chartData.length > 0) {
      chart
        .append('text')
        .attr('id', 'forlolCalculations2')
        .attr('font-family', 'UHCSans-Regular')
        .attr('font-size', '14px')
        .text(chartData2[0].name)
        .style('font-weight', '600');

      const text_element2 = chart.select('#forlolCalculations2');
      // tslint:disable-next-line:no-var-keyword
      const textWidth2 = text_element2.node().getComputedTextLength();
      chart.select('#forlolCalculations2').remove();

      // if (chartData2.name.length === 4) {
      //   textWidth2 = textWidth2 / 2;
      // } else if (chartData2.name.length === 3) {
      //   textWidth2 = textWidth2 * 1.25;
      // }

      /* Starts Data for tooltip */
      /*if (this.chartOptions.chartData2 != undefined && this.chartOptions.chartData2.length > 0) {
        // tslint:disable-next-line:no-var-keyword
        // const data2 = [];
         // tslint:disable-next-line:no-var-keyword
        var data = [];
        for (let v = 0; v < lengthOfData; v++) {
          data.push({
            y: chartData[v].value,
            y_twoYearsAgo: chartData2[v].value,
            xCoordinate: xScale(v),
            x: chartData[v].name
          });
        }
        for (let u = 0; u < lengthOfData2; u++) {
          data2.push({
            y: chartData2[u].value,
            y_lastYear: chartData[u].value,
            xCoordinate: xScale(u),
            x: chartData2[u].name,
            x_lastYear: chartData[u].name
          });
        }
      }
      /* Ends Data for tooltip */

      /* chart
        .append('g')
        .attr('visibility', 'hidden')
        .attr('id', 'forYCalculations2')
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(5, 0, 0)
            .tickSizeOuter([0])
            .ticks(3)
        );
      const preYArray2 = d3
        .select('#forYCalculations2')
        .selectAll('.tick>text')
        .nodes()
        .map(function(t) {
          return t.innerHTML;
        });

      d3.select('#forYCalculations2').remove();
      for (let c = 0; c < preYArray2.length; c++) {
        preYArray2[c] = preYArray2[c].replace(/,/g, '');
      }
      const preArrayOfNumbers2 = preYArray2.map(Number);
      const numberOfTicks2 = preArrayOfNumbers2.length;
      const highestTickValue2 = preArrayOfNumbers2[numberOfTicks2 - 1];
      */
    }

    // end if structure of chartData2

    // const RectBarOne = chart
    //   .selectAll('.rect-bar')
    //   .data(data)
    //   .enter()
    //   .append('rect')
    //   .style('fill', '#E3F0FD')
    //   .style('opacity', 0)
    //   .attr('class', 'rect-bar')
    //   .attr('x', function(d) {
    //     return d.xCoordinate - 22;
    //   })
    //   .attr('id', function(d) {
    //     return 'rect-id-' + d.x;
    //   })
    //   .attr('y', 0)
    //   .on('mouseover', d => {
    //     const RectBar = chart.selectAll('#rect-id-' + d.x);
    //     RectBar.transition()
    //       .duration(200)
    //       .style('opacity', 1)
    //       .style('cursor', 'pointer');
    //     const RectBarDot = chart.selectAll('#dot-id-' + d.x);
    //     RectBarDot.transition()
    //       .duration(200)
    //       .style('opacity', 1);

    //     tooltipVar
    //       .transition()
    //       .duration(200)
    //       .style('opacity', 1);
    //     const topMar = yScale(d.y) + 39 + 'px';
    //     if (d3.event.layerX + 213 < width + margin.left + margin.right) {
    //       tooltipVar
    //         .html(tooltipText(d, this.yearComparison, axisPrefix))
    //         .classed('hidden', false)
    //         .classed('tooltipClass', true)
    //         .classed('tooltipClassLeft', false)
    //         .style('left', d.xCoordinate + 56 + 'px')
    //         .style('top', topMar);
    //     } else {
    //       tooltipVar
    //         .html(tooltipText(d, this.yearComparison, axisPrefix))
    //         .classed('hidden', false)
    //         .classed('tooltipClass', false)
    //         .classed('tooltipClassLeft', true)
    //         .style('left', d.xCoordinate + 56 + shiftTooltip + 'px')
    //         .style('top', topMar);
    //     }
    //   })
    //   .on('mouseout', function(d) {
    //     const RectBar = chart.selectAll('#rect-id-' + d.x);
    //     RectBar.transition()
    //       .duration(200)
    //       .style('opacity', 0);
    //     const RectBarDot = chart.selectAll('#dot-id-' + d.x);
    //     RectBarDot.transition()
    //       .duration(200)
    //       .style('opacity', 0);

    //     tooltipVar
    //       .transition()
    //       .duration(500)
    //       .style('opacity', 0);
    //   });

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

    // Dark line
    if (this.chartOptions.lineOne.chartData != undefined && this.chartOptions.lineOne.chartData.length > 0) {
      chart
        .append('path')
        .datum(data)
        .attr('class', 'line')
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
        .attr('class', 'line2')
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
        .attr('class', 'line3')
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
        .attr('class', 'line4')
        .attr('d', line)
        .attr('id', 'LineFour')
        .style('fill', 'none')
        .style('stroke', this.chartOptions.lineFour.generalData.barColor)
        .style('stroke-dasharray', '7, 7')
        .style('stroke-width', '2');
    }

    /* if (this.chartOptions.chartData2 != undefined && this.chartOptions.chartData2.length > 0) {
      chart
        .selectAll('.dot2')
        .data(data2)
        .enter()
        .append('circle')
        .attr('class', 'dot2')
        .attr('cx', function(d) {
          return d.xCoordinate;
        })
        .attr('cy', function(d) {
          return yScale(d.y);
        })
        .attr('r', 5)
        .on('mouseover', d => {
          tooltipVar
            .transition()
            .duration(200)
            .style('opacity', 1);
          if (d3.event.layerX + 213 < width + margin.left + margin.right) {
            tooltipVar
              .html(tooltipText2(d, this.yearComparison, axisPrefix))
              .classed('hidden', false)
              .classed('tooltipClass', true)
              .classed('tooltipClassLeft', false)
              .style('left', d3.event.layerX + 23 + 'px')
              .style('top', d3.event.layerY + -20 + 'px');
          } else {
            tooltipVar
              .html(tooltipText2(d, this.yearComparison, axisPrefix))
              .classed('hidden', false)
              .classed('tooltipClass', false)
              .classed('tooltipClassLeft', true)
              .style('left', d3.event.layerX + 23 + shiftTooltip + 'px')
              .style('top', d3.event.layerY + -20 + 'px');
          }
        })
        .on('mouseout', function(d) {
          tooltipVar
            .transition()
            .duration(500)
            .style('opacity', 0);
        });
    }
    */

    chart
      .append('text')
      .attr('id', 'forTextCalculations')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .attr('font-size', '15px')
      .text(titleData[0].title);

    let text_element = chart.select('#forTextCalculations');
    let textWidth = text_element.node().getComputedTextLength();

    chart.select('#forTextCalculations').remove();

    chart
      .append('text')
      .attr('x', xScalePath(1) - textWidth / 2)
      .attr('y', -125)
      .style('font-size', '15px')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .style('fill', '#2D2D39')
      .text(titleData[0].title);

    // Start custom box
    if (titleData[0].topTitleBoxNumber) {
      let rectangleWidth = 130;
      const numberOfInt = titleData[0].topTitleBoxNumber.replace(/\D/g, '').length;

      if (numberOfInt === 2) {
        rectangleWidth = 110;
      } else if (numberOfInt === 3) {
        rectangleWidth = 130;
      } else if (numberOfInt === 4) {
        rectangleWidth = 150;
      } else if (numberOfInt === 5) {
        rectangleWidth = 170;
      } else if (numberOfInt === 6) {
        rectangleWidth = 190;
      } else if (numberOfInt === 7) {
        rectangleWidth = 210;
      } else {
        rectangleWidth = 230;
      }

      chart
        .append('rect')
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('x', xScalePath(1) - rectangleWidth / 2)
        .attr('y', -100)
        .attr('width', rectangleWidth)
        .attr('height', 54)
        .attr('fill', 'white')
        .attr('stroke', '#B3BABC')
        .attr('stroke-width', 1);
      chart
        .append('text')
        .attr('id', 'forTextCalculations')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .attr('font-size', '22px')
        .text(titleData[0].topTitleBoxNumber + ' ' + titleData[0].topTitleBoxNumberType);

      text_element = chart.select('#forTextCalculations');
      textWidth = text_element.node().getComputedTextLength();

      chart.select('#forTextCalculations').remove();

      chart
        .append('text')
        .attr('x', xScalePath(1) - textWidth / 2)
        .attr('y', -75)
        .style('font-size', '22px')
        .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .style('fill', '#2D2D39')
        .text(titleData[0].topTitleBoxNumber + ' ' + titleData[0].topTitleBoxNumberType);

      chart
        .append('text')
        .attr('id', 'forTextCalculations')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .attr('font-size', '15px')
        .text(titleData[0].percentageValue + '% ' + titleData[0].percentageValueType);

      text_element = chart.select('#forTextCalculations');
      textWidth = text_element.node().getComputedTextLength();

      chart.select('#forTextCalculations').remove();

      chart
        .append('text')
        .attr('x', xScalePath(1) - textWidth / 2)
        .attr('y', -55)
        .style('font-size', '15px')
        .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .style('fill', '#21B01E')
        .text(titleData[0].percentageValue + '% ' + titleData[0].percentageValueType);

      const polygonPoint = xScalePath(1) - textWidth / 2 - 7.5;

      chart
        .append('polygon')
        .style('stroke', '#21B01E')
        .style('fill', '#21B01E')
        .attr('points', polygonPoint + ',-60, ' + (polygonPoint + 2.5) + ',-57.5, ' + (polygonPoint + 5) + ',-60');
    } // end if structure of titleData // End custom box

    if (titleData[0].averagePeerPerformance) {
      let sumOfData = 0;
      for (let i = 0; i < chartData.length; i++) {
        sumOfData = sumOfData + chartData[i].value;
      }

      const average = sumOfData / chartData.length;

      chart
        .append('rect')
        .attr('x', 0)
        .attr('y', yScale(average))
        .attr('width', width)
        .attr('height', yScale(average))
        .attr('fill', 'rgba(0,168,247,0.3)');
    } // end if structure o titleData[0].averagePeerPerformance
  } // end dolineGraph Function
} // export class ends here
