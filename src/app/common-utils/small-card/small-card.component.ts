import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
  @Input() card: Object = {};
  data: Object = null;
  constructor() {}

  ngOnInit() {
    // this.data = this.card;
    this.data = {
      category: 'small-cards',
      type: 'donutWithTrend',
      title: 'Claims Yield',
      data: {
        cValues: [],
        cData: '',
        color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
        gdata: []
      },
      sdata: {
        sign: 'up',
        data: '+2.3%'
      },
      timeperiod: 'Timeperiod - Rolling 12 Months'
    };
  }
}
