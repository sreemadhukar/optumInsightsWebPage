import { Component, OnInit, Input } from '@angular/core';
// import * as d3 from 'd3';

@Component({
  selector: 'app-rlp-common-bar',
  templateUrl: './rlp-common-bar.component.html',
  styleUrls: ['./rlp-common-bar.component.scss']
})
export class RlpCommonBarComponent implements OnInit {
  @Input() type;
  @Input() data;
  renderedId: any;
  percentage: any;
  percentageName: any;
  config: any;
  constructor() {}

  ngOnInit() {
    this.config = {
      smallCard: {
        id: this.data.type + this.data.data.gdata.percentage + Math.floor(Math.random() * 1000) + 'small',
        height: '48px',
        width: '320px',
        color: ['#3381FF', '#E0E0E0'],
        percentage: this.data.data.gdata.percentage + '%'
      },
      largeCard: {
        id: this.data.type + this.data.data.gdata.percentage + Math.floor(Math.random() * 1000) + 'large',
        height: '48px',
        width: '765px',
        color: ['#3381FF', '#E0E0E0'],
        percentage: this.data.data.gdata.percentage + '%'
      },
      tableCard: {
        id:
          this.data.type +
          this.data.data.gdata.percentage +
          Math.floor(Math.random() * 1000) +
          'table' +
          Math.floor(Math.random() * 1000),
        height: '22px',
        width: '304px',
        color: ['#3381FF', '#E0E0E0'],
        percentage: this.data.data.gdata.percentage + '%'
      }
    };
  }
}
