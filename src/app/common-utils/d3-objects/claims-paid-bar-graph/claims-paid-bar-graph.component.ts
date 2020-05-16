import { Component, OnInit, Input, HostListener, AfterViewInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';

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

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
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

  maxTickValue(num) {
    const numOfDigits = num.toFixed(0).toString().length;
    const ceilingMultiplier = Math.pow(10, numOfDigits - 1);
    const maxCeilingValue = Math.ceil(num / ceilingMultiplier) * ceilingMultiplier;
    return maxCeilingValue;
  }
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
  formatAbbreviationGtoB(x) {
    let formatSi;
    if (Math.round(x).toString().length % 3 === 0) {
      formatSi = d3.format('$.2s');
    } else {
      formatSi = d3.format('$.1s');
    }
    const s = formatSi(x);
    switch (s[s.length - 1]) {
      case 'G':
        return s.slice(0, -1) + 'B';
    }
    return s;
  }
  doBarGraph(_chartOptions: any, _transition: number) {
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
      .attr('y', 65)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Total Billed');

    chart
      .append('text')
      .attr('x', 376)
      .attr('y', 64)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[0]));

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 134)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Actual Allowed');

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 154)
      .attr('fill', '#757588')
      .attr('font-size', '14')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('(Includes Member Responsibility)');

    chart
      .append('text')
      .attr('x', 376)
      .attr('y', 144)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[1]));

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 224)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Total Non-Payment');

    chart
      .append('svg:image')
      .attr('x', 316)
      .attr('y', 184)
      .attr('xlink:href', 'src/assets/images/icons/Content/round-insert_chart-24px - Copy.svg')
      .attr('width', 70)
      .attr('height', 70);

    chart
      .append('text')
      .attr('x', 32)
      .attr('y', 304)
      .attr('fill', '#2D2D39')
      .attr('font-size', '16')
      .style('text-anchor', 'start')
      .style('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .text('Total Paid By UHC');

    chart
      .append('text')
      .attr('x', 376)
      .attr('y', 304)
      .attr('fill', '#2D2D39')
      .attr('font-size', '20')
      .style('text-anchor', 'end')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$' + this.nFormatter(this.chartOptions.chartData[3]));

    chart
      .append('line')
      .attr('x1', 400)
      .attr('y1', 18)
      .attr('x2', 400)
      .attr('y2', 338)
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
      .scalePoint()
      .domain([0, highestValue])
      .range([400, 900]);

    const axisHidden = d3
      .axisBottom(xScale)
      .ticks(3)
      .tickSize(5, 0, 0);

    const firstAxis = chart
      .append('g')
      .attr('visibility', 'hidden')
      .attr('id', 'forCalculationz');

    firstAxis.call(axisHidden);

    const axisPrefix = '$';

    const highestTickValue = this.maxTickValue(highestValue);

    d3.scaleLinear()
      .domain([0, highestValue])
      .range([400, 900])
      .nice();

    chart
      .append('text')
      .attr('x', '400.5')
      .attr('y', '358')
      .attr('fill', '#2D2D39')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text('$0');

    chart
      .append('line')
      .attr('x1', 525.5)
      .attr('y1', 18)
      .attr('x2', 525.5)
      .attr('y2', 338)
      .attr('stroke', '#B3BABC')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7);

    chart
      .append('text')
      .attr('x', '525.5')
      .attr('y', '358')
      .attr('fill', '#2D2D39')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text(axisPrefix + this.nFormatter(highestTickValue * 0.25));

    chart
      .append('line')
      .attr('x1', 650.5)
      .attr('y1', 18)
      .attr('x2', 650.5)
      .attr('y2', 338)
      .attr('stroke', '#B3BABC')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7);

    chart
      .append('text')
      .attr('x', '650.5')
      .attr('y', '358')
      .attr('fill', '#2D2D39')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text(axisPrefix + this.nFormatter(highestTickValue * 0.5));

    chart
      .append('line')
      .attr('x1', 775.5)
      .attr('y1', 18)
      .attr('x2', 775.5)
      .attr('y2', 338)
      .attr('stroke', '#B3BABC')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7);

    chart
      .append('text')
      .attr('x', '775.5')
      .attr('y', '358')
      .attr('fill', '#2D2D39')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text(axisPrefix + this.nFormatter(highestTickValue * 0.75));

    chart
      .append('line')
      .attr('x1', 900.5)
      .attr('y1', 18)
      .attr('x2', 900.5)
      .attr('y2', 338)
      .attr('stroke', '#B3BABC')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7);

    chart
      .append('text')
      .attr('x', '900.5')
      .attr('y', '358')
      .attr('fill', '#2D2D39')
      .attr('font-size', '14')
      .attr('text-anchor', 'middle')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .text(axisPrefix + this.nFormatter(highestTickValue));

    // only used for bar objects
    const xScaleBar = d3
      .scaleLinear()
      .domain([0, highestTickValue])
      .range([0, 500]);

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
        .attr('y', 34)
        .attr('width', this.chartOptions.chartData[0])
        .attr('height', 48)
        .attr('fill', '#3381FF');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 114)
        .attr('width', this.chartOptions.chartData[1])
        .attr('height', 48)
        .attr('fill', '#3381FF');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 194)
        .attr('width', this.chartOptions.chartData[2])
        .attr('height', 48)
        .attr('fill', '#3381FF');
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 274)
        .attr('width', this.chartOptions.chartData[3])
        .attr('height', 48)
        .attr('fill', '#3381FF');
    } else {
      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 34)
        .attr('width', xScaleBar(this.chartOptions.chartData[0]))
        .attr('height', 48)
        .attr('fill', '#3381FF');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 114)
        .attr('width', xScaleBar(this.chartOptions.chartData[1]))
        .attr('height', 48)
        .attr('fill', '#3381FF');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 194)
        .attr('width', 170)
        .attr('height', 48)
        .attr('fill', '#E0E0E0');
      chart
        .append('text')
        .attr('x', 416)
        .attr('y', 224)
        .attr('font-size', '14')
        .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")

        .text('Metric in development');

      chart
        .append('rect')
        .attr('x', 400)
        .attr('y', 274)
        .attr('width', xScaleBar(this.chartOptions.chartData[3]))
        .attr('height', 48)
        .attr('fill', '#3381FF');
    }
  }
}
