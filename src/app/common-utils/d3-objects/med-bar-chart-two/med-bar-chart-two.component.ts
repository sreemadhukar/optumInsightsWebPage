import { ModalPopupService } from 'src/app/common-utils/modal-popup/modal-popup.service';
import { Component, OnInit, Input, HostListener, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-med-bar-chart-two',
  templateUrl: './med-bar-chart-two.component.html',
  styleUrls: ['./med-bar-chart-two.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedBarChartTwoComponent implements OnInit, AfterViewInit {
  public renderChart: string;
  @Input() chartOptions: any = {};
  @Input() numberData: any = {};
  public transition = 1;
  public noTransition = 0;

  constructor(private dialogService: ModalPopupService) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.doMedBarChart(this.chartOptions, this.noTransition);
  }

  ngOnInit() {
    this.renderChart = '#' + this.chartOptions.gdata[1];
  }

  ngAfterViewInit() {
    this.doMedBarChart(this.chartOptions, this.transition);
  }

  doMedBarChart(chartOptions: any, _transition: number) {
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

    chart = d3
      .select(this.renderChart)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    let totalSum = 0;

    for (let i = 0; i < chartOptions.graphValues.length; i++) {
      totalSum = totalSum + Number(chartOptions.graphValues[i]);
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, totalSum])
      .range([0, 248]);

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

    const uniqueText = 'reasonText' + this.renderChart.slice(1);
    const tspanID = uniqueText + 'tspan';
    let textWithHover;

    const barvalue = chartOptions.barText;
    const reasonDescp = barvalue.split('-');
    const reasonDescpValue = reasonDescp[reasonDescp.length - 1];
    let barTextValue = chartOptions.barText;

    if (chartOptions.barDescp === 'No description found on edit code file') {
      barTextValue = reasonDescp[0] + ' - ' + 'See Reference Guide';
      textWithHover = chart
        .append('text')
        .attr('id', uniqueText)
        .attr('x', 10)
        .attr('y', 12)
        .attr('fill', '#2D2D39')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .text(reasonDescp[0] + ' -');
      chart
        .append('text')
        .attr('x', 75)
        .attr('y', 12)
        .attr('fill', '#196ecf')
        .attr('font-size', '16')
        .attr('text-anchor', 'start')
        .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
        .attr('cursor', 'pointer')
        .text('See Reference Guide')
        .attr('class', 'reason-reference')
        .on(
          'click',
          function() {
            this.handleClick();
          }.bind(this)
        );
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
        .text(barTextValue)
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
        .on('mouseenter', function() {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 25 + 'px').style('top', d3.event.layerY - 85 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mousemove', function() {
          div
            .transition()
            .duration(10)
            .style('opacity', 1);
          div.style('left', d3.event.layerX - 25 + 'px').style('top', d3.event.layerY - 85 + 'px');
          // div.style('left', '100px').style('bottom', '70px');
        })
        .on('mouseleave', function() {
          div
            .transition()
            .duration(10)
            .style('opacity', 0);
        });
    }
  }
  public handleClick() {
    const showPopUp = sessionStorage.getItem('dontShowPCORpopup');
    if (JSON.parse(showPopUp)) {
      this.saveData();
    } else {
      const options = {
        title: 'You are being directed to the Smart Edits Reference Guide',
        message:
          'A new browser window will open the Smart Edits Reference Guide, which is being hosted on uhcprovider.com.',
        cancelText: 'No Thanks, Stay Here.',
        dontShowText: 'Don’t show me this again this session.',
        confirmText: 'Continue'
      };

      this.dialogService.open(options);

      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.saveData();
        }
      });
    }
  } // modalpopup function end
  saveData() {
    window.open('https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ACE-Smart-Edits.pdf');
  }
}
