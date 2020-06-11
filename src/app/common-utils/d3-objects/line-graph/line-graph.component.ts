import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation, HostBinding } from '@angular/core';
import * as d3 from 'd3';

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

    const preWidth = 961; // document.getElementById(generalData[0].parentDiv).clientWidth;

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
          tooltipVar
            .html(tooltipText(d, this.yearComparison, axisPrefix))
            .classed('hidden', false)
            .classed('tooltipClass', true)
            .classed('tooltipClassLeft', false)
            .style('left', d.xCoordinate + 56 + 'px')
            .style('top', topMar);
        } else {
          tooltipVar
            .html(tooltipText(d, this.yearComparison, axisPrefix))
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
