import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DonutChartComponent implements OnInit, AfterViewInit {
  public transition = 1;
  public noTransition = 0;
  public renderChart: string;
  public printStyle: boolean;
  public XLINK_HREF_PROP_NAME = 'xlink:href';
  public FLAT_NO_CHANGE_SVG = 'src/assets/images/flat-no-change.svg';
  public DOWN_POSITIVE_NO_IMG = 'src/assets/images/down-positive-no-circle.svg';
  public UP_NEGATIVE_NO_SVG = 'src/assets/images/up-negative-no-circle.svg';
  public UHC_MEDUIM_FONT = "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'";

  @Input() chartOptions: any = {};
  @Input() donutType: string;

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.doDonutChart(this.chartOptions, this.noTransition);
  }
  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
      this.doDonutChart(this.chartOptions, this.noTransition);
    } else {
      this.doDonutChart(this.chartOptions, this.transition);
    }
  }

  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  doDonutChart(chartOptions: any, transition: number) {
    const middleTextAlign = 'middle-text-align',
      smallCardFont = 'small-card-font',
      greenFont = 'green-font',
      redFont = 'red-font',
      middleFont = 'middle-font',
      startFont = 'start-font';
    function getTextWidth(txt, fontSize, fontFace) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = fontSize + 'px ' + fontFace;
      return context.measureText(txt).width;
    }

    function wrap(textObject, pixelWidth, uniqueID, fontSize) {
      textObject.each(function() {
        let word,
          line = [];
        const textLabel = d3.select(this),
          words = textLabel
            .text()
            .split(/\s+/)
            .reverse(),
          // lineNumber = 0,
          // lineHeight = 1.1, // ems
          y = textLabel.attr('y'),
          dy = parseFloat(textLabel.attr('dy'));
        let tspan = textLabel
          .text(null)
          .append('tspan')
          .attr('x', 12.5)
          .attr('y', y);

        if (!Number.isNaN(dy)) {
          tspan = textLabel
            .text(null)
            .append('tspan')
            .attr('x', 12.5)
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
            tspan = textLabel
              .append('tspan')
              .attr('x', 12.5)
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

    const topFunctions = this;
    const preWidth = document.getElementsByClassName(this.chartOptions.gdata[0])[0].clientWidth / 2;
    d3.select(this.renderChart)
      .selectAll('*')
      .remove();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    let width = preWidth - margin.left - margin.right;
    let height = width - margin.top - margin.bottom;

    let radius = Math.min(width, height) / 2.5;
    const donutColor = d3.scaleOrdinal().range(chartOptions.color);
    let circleThickness = 15;
    if (this.donutType === 'app-card') {
      width = 212;
      height = 212;
      radius = 105;
      circleThickness = 23;
    } else if (this.donutType === 'small-card') {
      width = 129;
      height = 129;
      radius = 64;
      circleThickness = 16;
    }

    const chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - circleThickness);

    const pie = d3
      .pie()
      .sort(null)
      .startAngle(0)
      .endAngle(2 * Math.PI)
      .padAngle(0.01)
      .value(function(d) {
        return d.value;
      });

    let heightDivider = 16;
    if (chartOptions.sdata) {
      heightDivider = -16;
    }
    let text;
    if (this.donutType === 'app-card') {
      if (this.chartOptions.gdata[1] === 'claimsAppealOverturnedRate') {
        text = chart
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 8)
          .attr('class', middleTextAlign);
      } else {
        if (this.chartOptions.centerData) {
          text = chart
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -15)
            .attr('class', middleTextAlign);
          chart
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 10)
            .attr('class', middleFont)
            .text(this.chartOptions.centerData);
        } else {
          text = chart
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', height / height)
            .attr('class', middleTextAlign);
        }
      }
    } else if (this.donutType === 'small-card') {
      text = chart
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', height / heightDivider)
        .attr('class', smallCardFont);
    }

    if (
      chartOptions.hasOwnProperty('sdata') &&
      chartOptions.sdata != undefined &&
      chartOptions.sdata != null &&
      chartOptions.sdata.sign != undefined &&
      chartOptions.sdata.sign != null &&
      chartOptions.sdata.sign !== ''
    ) {
      if (chartOptions.sdata.sign === 'up') {
        if (this.chartOptions.centerData) {
          const sdataLink = 'src/assets/images/trend-up.svg';
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#e1fadf'); // green color

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, sdataLink);
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', greenFont)
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#e1fadf'); // green color

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -35)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.DOWN_POSITIVE_NO_IMG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, 'src/assets/images/trend-up.svg');
          }
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', greenFont)
            .text(chartOptions.sdata.data);
        }
      } else if (chartOptions.sdata.sign === 'down') {
        if (this.chartOptions.centerData) {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#ffe6f0'); // red color

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, 'src/assets/images/trend-down.svg');
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', redFont)
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#ffe6f0');

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, 'src/assets/images/trend-down.svg');
          }

          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', redFont)
            .text(chartOptions.sdata.data);
        }
      } else if (chartOptions.sdata.sign === 'up-red') {
        if (this.chartOptions.centerData) {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#ffe6f0'); // red color

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', redFont)
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#ffe6f0');

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -35)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          }
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', redFont)
            .text(chartOptions.sdata.data);
        }
      } else if (chartOptions.sdata.sign === 'down-green') {
        if (this.chartOptions.centerData) {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#e1fadf'); // green color

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, this.DOWN_POSITIVE_NO_IMG);
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', greenFont)
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#e1fadf'); // green color

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.DOWN_POSITIVE_NO_IMG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr('fill', '#ffe6f0')
              .attr(this.XLINK_HREF_PROP_NAME, this.DOWN_POSITIVE_NO_IMG);
          }

          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', greenFont)
            .text(chartOptions.sdata.data);
        }
      } else if (chartOptions.sdata.sign === 'neutral') {
        if (this.chartOptions.centerData) {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#e0e0e0');

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, this.FLAT_NO_CHANGE_SVG);
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .attr('class', startFont)
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#e0e0e0');

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -34)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.FLAT_NO_CHANGE_SVG);
          }

          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', startFont)
            .text(chartOptions.sdata.data);
        }
      } else if (chartOptions.sdata.sign === 'pi-trend-neutral') {
        if (this.chartOptions.centerData) {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 40)
            .attr('r', 16)
            .attr('fill', '#e0e0e0');

          chart
            .append('svg:image')
            .attr('x', -34)
            .attr('y', 30)
            .attr('width', '20px')
            .attr('height', '20px')
            .attr(this.XLINK_HREF_PROP_NAME, this.FLAT_NO_CHANGE_SVG);
          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 45)
            .style('font-size', '14px')
            .style('fill', '#757588')
            .style('font-family', this.UHC_MEDUIM_FONT)
            .style('text-anchor', 'start')
            .text(chartOptions.sdata.data);
        } else {
          chart
            .append('circle')
            .attr('cx', -24)
            .attr('cy', 29)
            .attr('r', 16)
            .attr('fill', '#e0e0e0');

          if (chartOptions.hasOwnProperty('graphScreen') && chartOptions.graphScreen === 'PI') {
            chart
              .append('svg:image')
              .attr('x', -36)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.UP_NEGATIVE_NO_SVG);
          } else {
            chart
              .append('svg:image')
              .attr('x', -34)
              .attr('y', 19)
              .attr('width', '20px')
              .attr('height', '20px')
              .attr(this.XLINK_HREF_PROP_NAME, this.FLAT_NO_CHANGE_SVG);
          }

          chart
            .append('text')
            .attr('x', 0)
            .attr('y', 32)
            .attr('class', startFont)
            .text(chartOptions.sdata.data);
        }
      }
    } else {
      if (this.donutType === 'app-card') {
        text = chart
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 14)
          .attr('class', middleTextAlign);
      } else if (this.donutType === 'small-card') {
        text = chart
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 8)
          .attr('class', smallCardFont);
      }
    }

    const donutData = [];

    if (chartOptions.hasOwnProperty('labels')) {
      for (let i = 0; i < chartOptions.graphValues.length; i++) {
        donutData.push({
          value: chartOptions.graphValues[i],
          label: chartOptions.labels[i],
          color: chartOptions.color[i]
        });
      }
    } else {
      for (let i = 0; i < chartOptions.graphValues.length; i++) {
        donutData.push({ value: chartOptions.graphValues[i], color: chartOptions.color[i] });
      }
    }

    const g = chart
      .selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    if (transition) {
      g.append('path')
        .style('fill', function(d) {
          // return donutColor(d.data.value);
          return donutColor(d.data.color);
        })
        .transition()
        .delay(function(_d, i) {
          return i * 700;
        })
        .duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function(t) {
            text.text(chartOptions.centerNumber);
            text.text();
            d.endAngle = i(t);
            return arc(d);
          };
        });
    } else {
      g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
          // return donutColor(d.data.value);
          return donutColor(d.data.color);
        });

      text.text(chartOptions.centerNumber);
      text.text();
    }

    // chartOptions.hover
    if (chartOptions.hover === true) {
      const divHover = d3
        .select(this.renderChart)
        .append('div')
        .attr('class', 'tooltipDonut')
        .style('opacity', 0)
        .style('border-radius', 0);

      const svg2 = divHover.append('svg');

      let boxWidth = '113px';
      const boxHeight = '63px';
      let textWidth = 84;

      g.on('mouseenter', function(d) {
        if (d.data.label === 'Resubmitted Without Changes') {
          boxWidth = '150px';
          textWidth = 129;
        } else {
          boxWidth = '113px';
          textWidth = 84;
        }

        divHover.style('height', boxHeight).style('width', boxWidth);

        svg2.attr('height', boxHeight).attr('width', boxWidth);

        divHover
          .transition()
          .duration(10)
          .style('opacity', 1);
        divHover.style('left', d3.event.layerX + 7.5 + 'px').style('top', d3.event.layerY - 35 + 'px');

        let textLineOneY = '25px';
        let textLineTwoY = '47px';
        const lengthToShift = getTextWidth(d.data.label, 14, 'Arial');

        if (lengthToShift >= textWidth) {
          textLineOneY = '17px';
          textLineTwoY = '55px';
        }
        const uniqueText = 'labelText' + d.data.label;
        const tspanID = uniqueText + 'tspan';
        chartOptions.gdata[1] === 'claimsPaid' ||
        chartOptions.gdata[1] === 'claimsNotPaid' ||
        chartOptions.gdata[1] === 'claimsPaidCardD3Donut'
          ? (this.textOnHover = '$' + topFunctions.nFormatter(d.value, 1))
          : (this.textOnHover = topFunctions.nFormatter(d.value, 1));
        svg2
          .append('text')
          .attr('id', uniqueText)
          .attr('text-anchor', 'start')
          .attr('x', '12.5px')
          .attr('y', textLineOneY /*'25px'*/)
          .style('font-size', '14px')
          .style('fill', '#2D2D39')
          .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
          .text(d.data.label)
          .call(wrap, textWidth, tspanID, 14);

        svg2
          .append('text')
          .attr('text-anchor', 'start')
          .attr('x', '12.5px')
          .attr('y', textLineTwoY /*'47px'*/)
          .style('font-size', '14px')
          .style('fill', '#757588')
          .style('font-family', 'UHCSans-Regular')
          .text(this.textOnHover);
      })
        .on('mousemove', function() {
          divHover
            .transition()
            .duration(10)
            .style('opacity', 1);
          divHover.style('left', d3.event.layerX + 7.5 + 'px').style('top', d3.event.layerY - 35 + 'px');
        })
        .on('mouseleave', function() {
          divHover
            .transition()
            .duration(10)
            .style('opacity', 0);

          svg2.selectAll('*').remove();
        });
    }
  }
}
