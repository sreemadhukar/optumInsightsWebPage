import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
  @Input() data;
  /*
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
*/
  constructor() {}

  ngOnInit() {}
}
