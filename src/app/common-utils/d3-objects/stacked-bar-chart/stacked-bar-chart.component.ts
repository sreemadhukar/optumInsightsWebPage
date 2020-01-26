import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class StackedBarChartComponent implements OnInit {
  public width: any;
  public height: any;
  public renderChart: string;
  @Input() chartOptions: any = {};

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.chartId;
    console.log('this.chartOptions.chartId', this.chartOptions.chartId);
    this.doStaggedBarGraph(this.chartOptions.chartData);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.doStaggedBarGraph(this.chartOptions.chartData);
  }

  onResize(event) {
    this.doStaggedBarGraph(this.chartOptions.chartData);
  }

  onSystemChange() {
    this.doStaggedBarGraph(this.chartOptions.chartData);
  }

  // tslint:disable-next-line:use-life-cycle-interface

  doStaggedBarGraph(barData) {
    function nondecimalFormatter(fnumber) {
      if (fnumber >= 1000000000) {
        return (fnumber / 1000000000).toFixed(0).replace(/\.0$/, '') + 'B';
      }
      if (fnumber >= 1000000) {
        return (fnumber / 1000000).toFixed(0).replace(/\.0$/, '') + 'M';
      }
      if (fnumber >= 1000) {
        return (fnumber / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
      }
      if (fnumber < 1000) {
        return fnumber.toFixed(0).replace(/\.0$/, '');
      }
      return fnumber;
    }
    // ends formatDynamicAbbrevia function

    /* function formatDynamicAbbreviation(tickNumber, tickValue, prefix) {
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
    } */

    // Need to bind with js
    /* const chartData = {
      leftSide: [
        {
          label: 'Electronic Claims',
          dataTextValue: '$8.7 M',
          dataPercent: '86.4%',
          color: 'blue'
        },
        {
          label: 'Paper Claims',
          dataTextValue: '$261.7 K',
          dataPercent: '3.3%',
          color: 'red'
        }
      ]
    };*/

    d3.select(this.renderChart)
      .selectAll('*')
      .remove();
    // select the svg container first
    // const width = 550;
    // const height = 400;
    const width = 450;
    const height = 350;
    const barSeparator = 4;
    const svg = d3
      .select('.canvas')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // create margins & dimensions
    const margin = { top: -20, right: 40, bottom: 100, left: 200 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.bottom;

    const graph = svg
      .append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('transform', `translate(${margin.left - 50}, ${margin.top})`);

    // create axes groups
    const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);

    const yAxisGroup = graph.append('g');
    const leftContainer = svg.append('g').attr('transform', `translate(${margin.left - 190}, ${margin.top + 110})`);

    console.log('Hiiii', barData);

    const data = [
      {
        name: 'Stacked Bar Chart',
        electronic: 312525450,
        paper: 15277119
      }
    ];

    // Data Binding to be used
    /*const data = [
      {
        name: 'Stacked Bar Chart',
        electronic: barData.Electronic_Claims.toFixed(0),
        paper: barData.Paper_Claims.toFixed(0)
      }
    ];*/

    console.log('left Cont', leftContainer);
    // d3.json('menu').then(data => {
    leftContainer
      .append('circle')
      .attr('cx', () => 10)
      .attr('cy', () => 5)
      .attr('r', () => 8)
      .attr('fill', '#3381FF');

    leftContainer
      .append('text')
      .attr('x', () => 25)
      .attr('y', () => 10)
      .attr('fill', 'black')
      .text('Electronic Claims')
      .classed('labels', true);

    /* leftContainer
      .append('text')
      .attr('x', () => 40)
      .attr('y', () => 40)
      .attr('fill', 'black')
      .text('$8.7 M (86.4%)')
      .style('font-family', 'Arial')
      .style('font-size', '13px'); */

    leftContainer
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 40)
      .attr('r', 8)
      .attr('fill', '#00B8CC');

    leftContainer
      .append('text')
      .attr('x', () => 25)
      .attr('y', () => 45)
      .attr('fill', 'black')
      .text('Paper Claims')
      .classed('labels', true);

    /* leftContainer
      .append('text')
      .attr('x', 40)
      .attr('y', 90)
      .attr('fill', 'black')
      .text('$261.7 K (3.3%)')
      .style('font-family', 'Arial')
      .style('font-size', '13px'); */

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.electronic + d.paper) * 1.25])
      .range([graphHeight, 0]);

    const x = d3
      .scaleBand()
      .domain(data.map(item => item.name))
      .range([0, graphWidth])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    graph
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSize(-200, 0, 0)
          .tickFormat('')
          .tickSizeOuter([0])
      );

    // Prep the tooltip bits, initial display is hidden

    const rects = graph.selectAll('rect').data(data);
    const rects2 = graph.selectAll('rect').data(data);
    const rects3 = graph.selectAll('rect').data(data);

    const tooltip = d3
      .select('.canvas')
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip
      .append('rect')
      .attr('width', 109)
      .attr('height', 66)
      .attr('fill', 'white')
      .style('opacity', 1);

    tooltip.append('text');

    // add attrs to circs already in the DOM
    rects
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.electronic))
      .attr('fill', '#3381FF')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic));

    // append the enter selection to the DOM
    rects
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.electronic))
      .attr('fill', '#3381FF')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic))
      .on('mouseover', function(d) {
        tooltip.select('text').html(printTextElectronic(d.electronic));
        tooltip.style('display', 'inline-flex'), tooltip.style('top', '180px');
      })
      .on('mouseout', function() {
        tooltip.style('display', 'none');
      });

    rects2
      .attr('width', x.bandwidth)
      .attr('height', barSeparator)
      .attr('fill', '#FFF')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic) - barSeparator);

    // append the enter selection to the DOM
    rects2
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', barSeparator)
      .attr('fill', '#FFF')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic) - barSeparator);

    rects3
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.paper))
      .attr('fill', '#00B8CC')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic) - barSeparator - (graphHeight - y(d.paper)));

    // append the enter selection to the DOM
    rects3
      .enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => graphHeight - y(d.paper))
      .attr('fill', '#00B8CC')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.electronic) - barSeparator - (graphHeight - y(d.paper)))
      .on('mouseover', function(d) {
        tooltip.select('text').html(printTextPaper(d.paper)),
          tooltip.style('display', 'inline-flex'),
          tooltip.style('top', '50px');
      })
      .on('mouseout', function() {
        tooltip.style('display', 'none');
      });

    // create & call axes
    const xAxis = d3.axisBottom(x);
    const yAxis = graph
      .append('g')
      .attr('class', 'yscalesize')
      .attr('transform', `translate(${graphWidth - 15}, 0)`)
      .call(
        d3
          .axisRight(y)
          .ticks(4)
          .tickFormat(d => '$ ' + nondecimalFormatter(d))
      );

    //    .tickFormat(d3.formatPrefix('.1', 1e3));

    // xAxisGroup.call(xAxis);
    yAxisGroup.attr('transform', `translate(${graphWidth}, 0)`).call(yAxis);
    // });

    function printTextPaper(value) {
      return (
        `<div class='textHeading'>  Paper Claims</div>
        <div class='textValue'> $` +
        nondecimalFormatter(value) +
        '</div>'
      );
    }

    function printTextElectronic(value) {
      return (
        `<div class='textHeading'> Electronic Claims</div>
             <div class='textValue'> $` +
        nondecimalFormatter(value) +
        '</div>'
      );
    }
  }
}
