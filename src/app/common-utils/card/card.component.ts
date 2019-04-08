import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() card: Object = {};
  data: Object = null;
  labelColor: Array<Object> = null;
  constructor() {}

  ngOnInit() {
    this.data = this.card;
    console.log('', this.data);
  }
}
