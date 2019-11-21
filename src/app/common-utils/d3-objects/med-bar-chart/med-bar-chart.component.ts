import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-med-bar-chart',
  templateUrl: './med-bar-chart.component.html',
  styleUrls: ['./med-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedBarChartComponent implements OnInit, AfterViewInit {
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() numberData: any = {};
  public transition = 1;
  public noTransition = 0;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.doMedBarChart(this.chartOptions, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doMedBarChart(this.chartOptions, this.transition);
  }

  doMedBarChart(chartOptions: any, transition: number) {
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
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy'));
        let tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 10)
          .attr('y', y);

        if (!Number.isNaN(dy)) {
          tspan = text
            .text(null)
            .append('tspan')
            .attr('x', 1)
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
              .attr('x', 10)
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
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth; // 464;
    // Change Pre width to dynamic value after toggle off
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 10, right: 0, bottom: 10, left: 0 };
    const width = preWidth - margin.left - margin.right;
    const height = 50 - margin.top - margin.bottom;
    let chart;
    if (chartOptions.cdata && chartOptions.cdata === 'paymentintegrity') {
      chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 100)
        .append('g')
        .attr('transform', 'translate(' + 10 + ',' + 50 + ')');
    } else {
      chart = d3
        .select(this.renderChart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + 10 + ',' + 0 + ')');
    }
    let totalSum = 0;

    for (let i = 0; i < chartOptions.graphValues.length; i++) {
      totalSum = totalSum + Number(chartOptions.graphValues[i]);
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, totalSum])
      .range([0, 248]);

    if (chartOptions.cdata && chartOptions.cdata === 'paymentintegrity') {
      chart
        .append('rect')
        .attr('x', 10)
        .attr('y', -25)
        .attr('id', 'paymentIntegrityRect')
        .attr('width', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('height', 48)
        .style('padding-bottom', 16)
        .attr('fill', chartOptions.color[0]);

      chart
        .append('rect')
        .attr('x', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return 10 + xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('y', -25)
        .attr('width', 2)
        .attr('height', 48)
        .attr('fill', chartOptions.color[1]);

      chart
        .append('rect')
        .attr('x', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return 12 + xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('y', -25)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[1]) + 1;
          }
        })
        .attr('height', 48)
        .attr('fill', chartOptions.color[2]);
    } else {
      chart
        .append('rect')
        .attr('x', 10)
        .attr('y', 20)
        .attr('width', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('height', 24)
        .style('padding-bottom', 16)
        .attr('fill', chartOptions.color[0]);

      chart
        .append('rect')
        .attr('x', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return 10 + xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('y', 20)
        .attr('width', 2)
        .attr('height', 24)
        .attr('fill', chartOptions.color[1]);

      chart
        .append('rect')
        .attr('x', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return 12 + xScale(chartOptions.graphValues[0]);
          }
        })
        .attr('y', 20)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[1]) + 1;
          }
        })
        .attr('height', 24)
        .attr('fill', chartOptions.color[2]);
    }
    const uniqueText = 'reasonText' + this.renderChart.slice(1);
    const tspanID = uniqueText + 'tspan';
    let textWithHover;
    if (chartOptions.cdata && chartOptions.cdata === 'paymentintegrity') {
      textWithHover = chart
        .append('text')
        .attr('id', uniqueText)
        .attr('x', 10)
        .attr('y', -35)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barText)
        .call(wrap, 250, tspanID, 16);
    } else {
      textWithHover = chart
        .append('text')
        .attr('id', uniqueText)
        .attr('x', 10)
        .attr('y', 12)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barText)
        .call(wrap, 250, tspanID, 16);
    }
    // where we should enable the hover object to exist
    if (textWithHover.selectAll('tspan').size() > 1) {
      d3.select('#' + uniqueText).attr('cursor', 'pointer');
      const tspanArray = textWithHover.selectAll('tspan').nodes();
      const tspanArrayIDs = [];
      const replacementtspan = tspanArray[0];
      d3.select(replacementtspan).text(replacementtspan.textContent + '...');

      for (let i = 0; i < tspanArray.length; i++) {
        tspanArrayIDs.push(tspanArray[i].id);
      }
      for (let i = tspanArrayIDs.length - 1; i > 0; i--) {
        d3.select('#' + tspanArrayIDs[i]).remove();
      }

      const div = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'tooltip-bar')
        .style('height', 'auto')
        .style('width', '253px')
        .style('opacity', 0);

      const svg2 = div
        .append('svg')
        .attr('height', 30 * tspanArray.length + 'px')
        .attr('width', '253px');

      svg2
        .append('text')
        .attr('id', uniqueText + 'hover')
        .attr('y', (height + 10) / 2)
        .attr('fill', '#2D2D39')
        .attr('font-size', '14')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barText)
        // .call(wrap, 250, tspanID, 16);
        .call(wrap, 250, tspanID + 'hover', 14);

      const label = d3.select('#' + uniqueText).selectAll('*');

      label
        .on('mouseenter', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 25 + 'px').style('top', d3.event.layerY - 85 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mousemove', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 25 + 'px').style('top', d3.event.layerY - 85 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mouseleave', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 0);
        });
    } else if (chartOptions.cdata && chartOptions.cdata === 'paymentintegrity') {
      d3.select('#' + uniqueText).attr('cursor', 'pointer');
      const tspanArray = textWithHover.selectAll('tspan').nodes();
      const tspanArrayIDs = [];

      for (let i = 0; i < tspanArray.length; i++) {
        tspanArrayIDs.push(tspanArray[i].id);
      }
      for (let i = tspanArrayIDs.length - 1; i > 0; i--) {
        d3.select('#' + tspanArrayIDs[i]).remove();
      }

      const div = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'tooltip-bar-pi')
        .style('height', 'auto')
        .style('width', '150px')
        .style('opacity', 0);

      const svg2 = div
        .append('svg')
        .attr('height', '62px')
        .attr('width', '150px');

      svg2
        .append('text')
        .attr('id', uniqueText + 'hover')
        .attr('x', 16)
        .attr('y', 25)
        .attr('fill', '#2D2D39')
        .attr('font-size', '14')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barText)
        // .call(wrap, 250, tspanID, 16);
        .call(wrap, 250, tspanID + 'hover', 14);

      svg2
        .append('text')
        .attr('id', uniqueText + 'hover')
        .attr('x', 16)
        .attr('y', 45)
        .attr('fill', '#757588')
        .attr('font-size', '14')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.hoverData)
        // .call(wrap, 250, tspanID, 16);
        .call(wrap, 250, tspanID + 'hover', 14);

      const label = d3.select('#paymentIntegrityRect');

      label
        .on('mouseenter', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 75 + 'px').style('top', d3.event.layerY - 75 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mousemove', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 75 + 'px').style('top', d3.event.layerY - 75 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mouseleave', function(d) {
          div
            .transition()
            .duration(10)
            .style('opacity', 0);
        });
    }

    if (chartOptions.cdata && chartOptions.cdata === 'paymentintegrity') {
      chart
        .append('line')
        .attr('x1', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[0]) + 4;
          }
        })
        .attr('y1', -29)
        .attr('x2', function() {
          if (typeof chartOptions.graphValues[0] !== 'undefined') {
            return xScale(chartOptions.graphValues[0]) + 4;
          }
        })
        .attr('y2', 33)
        .style('stroke-dasharray', '6,6')
        .style('stroke', 'black')
        .style('stroke-width', '2px');
      chart
        .append('text')
        .attr('x', 270)
        .attr('y', 5)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barValue);
      if (chartOptions.targetValue.includes('above target')) {
        chart
          .append('svg:image')
          .attr('x', 10)
          .attr('y', 35)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/greencheckmark.svg');
        chart
          .append('text')
          .attr('x', 35)
          .attr('y', 50)
          .attr('fill', '#007000')
          .attr('font-size', '16')
          .attr('text-anchor', 'start')
          .attr('font-family', "'UHCSans','Helvetica', 'Arial', 'sans-serif'")
          .text(chartOptions.targetValue);
      } else {
        chart
          .append('svg:image')
          .attr('x', 10)
          .attr('y', 35)
          .attr('width', '20px')
          .attr('height', '20px')
          .attr('xlink:href', 'src/assets/images/red-x.svg');
        chart
          .append('text')
          .attr('x', 35)
          .attr('y', 50)
          .attr('fill', '#B10C00')
          .attr('font-size', '16')
          .attr('text-anchor', 'start')
          .attr('font-family', "'UHCSans','Helvetica', 'Arial', 'sans-serif'")
          .text(chartOptions.targetValue);
      }
      chart
        .append('text')
        .attr('x', 200)
        .attr('y', 50)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text('Target 90%');
    } else {
      chart
        .append('text')
        .attr('x', 270)
        .attr('y', 38)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(chartOptions.barValue);
    }
  }
}
