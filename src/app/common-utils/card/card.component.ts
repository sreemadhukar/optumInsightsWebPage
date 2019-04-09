import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  _card: Object = {};
  data: Object = {};
  get card(): Object {
    return this._card;
  }

  @Input('card')
  set card(value: Object) {
    this._card = value;
    this.data = value;
  }

  constructor() {}

  ngOnInit() {}
}
