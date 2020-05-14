import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  printStyle: boolean;
  public chartPA;
  public chartPCOR;
  @Input() chartOptions: any = {};

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.doBarChart(this.chartOptions, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }

  ngAfterViewInit() {
    this.doBarChart(this.chartOptions, this.transition);
  }

  doBarChart(chartOptions: any, _transition: number) {
    function formatDy(dy: number): string {
      if (dy === 0) {
        return '0.0M';
      } else if (dy < 999) {
        return dy.toFixed(0);
      } else if (dy < 999999) {
        return (dy / 1000).toFixed(1) + 'K';
      } else if (dy) {
        return (dy / 1000000).toFixed(1) + 'M';
      }
    }

    function getTextWidth(text, fontSize, fontFace) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = fontSize + 'px ' + fontFace;
      return context.measureText(text).width;
    }

    function wrap(textObject, pixelWidth, uniqueID, fontSize) {
      textObject.each(function() {
        let word,
          line = [];
        const text = d3.select(this),
          words = text
            .text()
            .split(/\s+/)
            .reverse(),
          // lineNumber = 0,
          // lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy'));
        let tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 15)
          .attr('y', y)
          .attr('dy', dy + 'em');

        if (!Number.isNaN(dy)) {
          tspan = text
            .text(null)
            .append('tspan')
            .attr('x', 15)
            .attr('y', y)
            .attr('dy', dy + 'em');
        }
        let i = 0;
        let dyMultiplier = 1;
        while ((word = words.pop())) {
          line.push(word);
          const line2 = line.join(' ');
          tspan.text(line.join(' '));
          if (getTextWidth(line2, fontSize, 'Arial') > pixelWidth) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text
              .append('tspan')
              .attr('x', 15)
              .attr('y', y)
              .attr('dy', 20 * dyMultiplier + 'px')
              .attr('id', uniqueID + i)
              .text(word);
            i++;
            dyMultiplier++;
          }
        }
      });
    }
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    let barHeight = 48;
    if (chartOptions.barHeight) {
      barHeight = chartOptions.barHeight; // bar height to be 48
    }

    const margin = { top: 16, right: 10, bottom: 16, left: 10 };
    const width = preWidth - margin.left - margin.right;
    const height = barHeight * 1.5 - margin.top - margin.bottom;
    const svg = d3.select(this.renderChart);

    let xScaleConstant;

    /** Following 2 variable are for Prior Auth Bar Grpah */
    let xScaleBarWidthConstant;
    let xScaleBarStartingPointConstant;
    /** Following 2 variable are for Prior Auth Bar Grpah */

    if (chartOptions.starObject) {
      xScaleConstant = width - 231; // For PCOR graph width should be 703

      this.chartPCOR = svg
        .append('svg')
        .attr('width', xScaleConstant)
        .attr('height', height + margin.top + margin.bottom + 8)
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + (margin.top + 3) + ')');
    } else {
      /** Following 2 variable are for Prior Auth Bar Grpah */
      xScaleBarWidthConstant = width / 1.79; // 522    when width is 554 , it will touch the border of the the card
      xScaleBarStartingPointConstant = width / 2.43; // 384
      const paddingVertical = (height + margin.top + margin.bottom - barHeight) / 2;
      this.chartPA = svg
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (margin.left + 6) + ',' + paddingVertical + ')');
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, chartOptions.barSummation])
      .range([0, xScaleConstant]);

    const xScaleBarWidth = d3
      .scaleLinear()
      .domain([0, chartOptions.barSummation])
      .range([0, xScaleBarWidthConstant]);

    // PCOR quality measure bar graph
    if (chartOptions.starObject) {
      // const PCORStars = chartOptions.starCount;
      // const PCORStarXCoordinateMultiplier = 17.5;

      // for (let i = 0; i < PCORStars; i++) {
      //   const xCoordinate = 14 + PCORStarXCoordinateMultiplier * i;

      //   this.chartPCOR
      //     .append('g')
      //     .attr('transform', 'translate(' + xCoordinate + ',' + 16 + ')')
      //     .append('polygon')
      //     .attr('fill', '#3381FF')
      //     .attr(
      //     'points',
      //     '8 13.2668737 3.05572809 16 4 10.2111456 -3.02535774e-13 6.11145618 5.52786405 5.26687371 8 0 ' +
      //     '10.472136 5.26687371 16 6.11145618 12 10.2111456 12.9442719 16'
      //     );
      // }
      // This belongs to PCOR
      this.chartPCOR
        .append('rect')
        .attr('x', 36)
        .attr('y', 0)
        .attr('width', xScale(chartOptions.barData))
        .attr('height', barHeight)
        .attr('fill', chartOptions.color[0].color1);
      this.chartPCOR
        .append('text')
        .attr('x', 20)
        // 20 will make this text attached with bar graph and moving 16px from right is the requirement
        .attr('y', 31)
        .attr('fill', '#2D2D39')
        .attr('font-size', '20')
        .attr('text-align', 'right')
        .style('text-anchor', 'end')
        .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barData);
    } else {
      this.chartPA
        .append('rect')
        .attr('x', xScaleBarStartingPointConstant)
        .attr('y', 0)
        .attr('width', xScaleBarWidth(chartOptions.barData))
        .attr('height', barHeight)
        .attr('fill', chartOptions.color[0].color1);

      if (chartOptions.color.length === 2) {
        this.chartPA
          .append('rect')
          .attr('x', xScaleBarStartingPointConstant)
          .attr('y', 0)
          .attr('width', xScaleBarWidth(chartOptions.barSummation) - xScaleBarWidth(chartOptions.barData))
          .attr('height', barHeight)
          .attr('fill', chartOptions.color[1].color2);
      }

      const uniqueText = 'reasonText' + this.renderChart.slice(1);
      const tspanID = uniqueText + 'tspan';
      const textWithHover = this.chartPA
        .append('text')
        .attr('id', uniqueText)
        .attr('x', xScale(chartOptions.barSummation / 10))
        .attr('y', (height + 10) / 2)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barText)
        .call(wrap, 250, tspanID, 16);

      // Shift text object up for 2+ line reasons
      if (textWithHover.selectAll('tspan').size() > 1) {
        d3.select('#' + uniqueText)
          .attr('transform', 'translate(' + 0 + ',' + -7.5 + ')')
          .attr('cursor', 'pointer');
      }

      // where we should enable the hover object to exist
      if (textWithHover.selectAll('tspan').size() > 2) {
        const tspanArray = textWithHover.selectAll('tspan').nodes();
        const tspanArrayIDs = [];
        const replacementtspan = tspanArray[1];
        for (let i = 0; i < tspanArray.length; i++) {
          tspanArrayIDs.push(tspanArray[i].id);
        }

        for (let i = tspanArrayIDs.length - 1; i > 0; i--) {
          d3.select('#' + tspanArrayIDs[i]).remove();
        }

        d3.select('#' + uniqueText)
          .append('tspan')
          .attr('x', replacementtspan.getAttribute('x'))
          .attr('y', replacementtspan.getAttribute('y'))
          .attr('dy', replacementtspan.getAttribute('dy'))
          .attr('id', replacementtspan.id + 'new')
          .text(replacementtspan.textContent + '...');

        const div = d3
          .select(this.renderChart)
          .append('div')
          .attr('class', 'tooltip')
          .style('height', 'auto')
          .style('width', '438px')
          .style('opacity', 0)
          .style('border-radius', '2px');

        const svg2 = div
          .append('svg')
          .attr('height', 20 * tspanArray.length + 'px')
          .attr('width', '438px');

        // need to make id clean
        svg2
          .append('text')
          .attr('id', uniqueText + 'hover')
          .attr('y', (height + 10) / 2)
          .attr('fill', '#2D2D39')
          .attr('font-size', '14')
          .attr('text-anchor', 'start')
          .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
          .text(chartOptions.barText)
          .call(wrap, 420, tspanID + 'hover', 14);

        const label = d3.select('#' + uniqueText).selectAll('*');

        let tooltipLabelAdjustor = 120;
        if (tspanArray.length === 3) {
          tooltipLabelAdjustor = 80;
        } else if (tspanArray.length === 8) {
          tooltipLabelAdjustor = 160;
        }

        label
          .on('mouseenter', function() {
            div
              .transition()
              .duration(10)
              .style('opacity', 1);
            div.style('left', d3.event.layerX - 38 + 'px').style('top', d3.event.layerY - tooltipLabelAdjustor + 'px');
          })
          .on('mousemove', function() {
            div
              .transition()
              .duration(10)
              .style('opacity', 1);
            div.style('left', d3.event.layerX - 38 + 'px').style('top', d3.event.layerY - tooltipLabelAdjustor + 'px');
          })
          .on('mouseleave', function() {
            div
              .transition()
              .duration(10)
              .style('opacity', 0);
          });
      }
      // This if for Prior Auth
      this.chartPA
        .append('text')
        .attr('x', xScaleBarStartingPointConstant - 24) // text should be 24px from the bar
        .attr('y', (barHeight + 8) / 2)
        .attr('fill', '#2D2D39')
        .attr('font-size', '20')
        .attr('float', 'right')
        .style('text-anchor', 'end')
        .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")

        .text(formatDy(chartOptions.barData));
    }
  }
}
