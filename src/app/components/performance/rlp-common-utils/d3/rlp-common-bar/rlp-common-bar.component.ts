import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rlp-common-bar',
  templateUrl: './rlp-common-bar.component.html',
  styleUrls: ['./rlp-common-bar.component.scss']
})
export class RlpCommonBarComponent implements OnInit, AfterViewInit {
  @Input() type;
  renderedId: any;
  constructor() {}

  ngOnInit() {
    this.renderedId = '#' + this.type;
  }
  ngAfterViewInit() {
    if (this.type === 'rlp-small-bar') {
      this.smallBar();
    } else if (this.type === 'rlp-large-bar') {
      this.largeBar();
    } else {
      this.tableBar();
    }
  }
  smallBar() {
    const barComponent = d3
      .select(this.renderedId)
      .style('font-family', 'UHCSans-Regular')
      .append('div')
      .style('background-color', 'white');
    barComponent.style('width', '375px').style('height', '78px');
    const barHeader = barComponent
      .append('div')
      .text('582/895 Referrals')
      .style('width', '248px')
      .style('height', '30px')
      .style('font-size', '16px')
      .style('line-height', '22px')
      .style('letter-spacing', '0.2px');
    const barBody = barComponent.append('div').style('display', 'flex');
    const bar = barBody
      .append('div')
      .style('width', '320px')
      .style('height', '48px')
      .style('display', 'flex')
      .style('border', '0 2px 2px 0');
    const barLeft = bar
      .append('div')
      .style('width', '65%')
      .style('height', '100%')
      .style('background-color', '#3381FF');
    const barDivider = bar
      .append('div')
      .style('width', '1px')
      .style('height', '100%')
      .style('background-color', 'white');
    const barRight = bar
      .append('div')
      .style('flex-grow', '1')
      .style('height', '100%')
      .style('background-color', '#E0E0E0');
    const barPercentage = barBody
      .append('div')
      .text('65%')
      .style('width', '39px')
      .style('height', '22px')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('line-height', '22px')
      .style('margin-top', '13px')
      .style('margin-left', '16px')
      .style('letter-spacing', '0.2px')
      .style('display', 'flex');
  }
  largeBar() {
    const barComponent = d3
      .select(this.renderedId)
      .style('font-family', 'UHCSans-Regular')
      .append('div')
      .style('background-color', 'white');
    barComponent.style('width', '865px').style('height', '78px');
    const barHeader = barComponent
      .append('div')
      .text('582/895 Referrals')
      .style('width', '592.55px')
      .style('height', '30px')
      .style('font-size', '16px')
      .style('line-height', '22px')
      .style('letter-spacing', '0.2px');
    const barBody = barComponent.append('div').style('display', 'flex');
    const bar = barBody
      .append('div')
      .style('width', '765.39px')
      .style('height', '48px')
      .style('display', 'flex')
      .style('border', '0 2px 2px 0');
    const barLeft = bar
      .append('div')
      .style('width', '65%')
      .style('height', '100%')
      .style('background-color', '#3381FF');
    const barDivider = bar
      .append('div')
      .style('width', '2.39px')
      .style('height', '100%')
      .style('background-color', 'white');
    const barRight = bar
      .append('div')
      .style('flex-grow', '1')
      .style('height', '100%')
      .style('background-color', '#E0E0E0');
    const barPercentage = barBody
      .append('div')
      .text('65%')
      .style('width', '39px')
      .style('height', '22px')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('line-height', '22px')
      .style('margin-top', '13px')
      .style('margin-left', '16px')
      .style('letter-spacing', '0.2px')
      .style('display', 'flex');
  }

  tableBar() {
    const barComponent = d3
      .select(this.renderedId)
      .style('font-family', 'UHCSans-Regular')
      .append('div')
      .style('background-color', 'white')
      .style('display', 'flex');
    barComponent.style('width', '429px').style('height', '22px');
    const barHeader = barComponent
      .append('div')
      .text('88/152')
      .style('width', '59px')
      .style('height', '22px')
      .style('font-size', '16px')
      .style('line-height', '22px')
      .style('letter-spacing', '0.2px');
    const barBody = barComponent.append('div').style('display', 'flex');
    const bar = barBody
      .append('div')
      .style('width', '304px')
      .style('height', '22px')
      .style('display', 'flex')
      .style('margin-left', '16px')
      .style('border', '0 2px 2px 0');
    const barLeft = bar
      .append('div')
      .style('width', '65%')
      .style('height', '100%')
      .style('background-color', '#3381FF');
    const barDivider = bar
      .append('div')
      .style('width', '1.15px')
      .style('height', '100%')
      .style('background-color', 'white');
    const barRight = bar
      .append('div')
      .style('flex-grow', '1')
      .style('height', '100%')
      .style('background-color', '#E0E0E0');
    const barPercentage = barBody
      .append('div')
      .text('65%')
      .style('width', '39px')
      .style('height', '22px')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('line-height', '22px')
      .style('margin-left', '16px')
      .style('letter-spacing', '0.2px')
      .style('display', 'flex');
  }
}
