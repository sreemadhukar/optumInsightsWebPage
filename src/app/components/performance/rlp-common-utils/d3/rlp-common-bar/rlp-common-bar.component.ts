import { Component, OnInit, Input } from '@angular/core';

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
        id: this.data.type + this.data.data.gdata.percentage[0] + Math.floor(Math.random() * 1000) + 'small',
        height: '48px',
        width: '320px',
        color: this.data.data.gdata.color,
        baseLine: this.data.data.gdata.baseLine, // if baseline is zero the line wont show
        percentage: this.data.data.gdata.percentage
      },
      largeCard: {
        id: this.data.type + this.data.data.gdata.percentage[0] + Math.floor(Math.random() * 1000) + 'large',
        height: '48px',
        width: '765px',
        color: this.data.data.gdata.color,
        baseLine: this.data.data.gdata.baseLine,
        percentage: this.data.data.gdata.percentage
      },
      tableCard: {
        id:
          this.data.type +
          this.data.data.gdata.percentage[0] +
          Math.floor(Math.random() * 1000) +
          'table' +
          Math.floor(Math.random() * 1000),
        height: '22px',
        width: '304px',
        color: this.data.data.gdata.color,
        baseLine: this.data.data.gdata.baseLine,
        percentage: this.data.data.gdata.percentage
      }
    };
  }
}
