import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
  @Input() card: Object = {};
  data: Object = this.card;
  constructor() {}

  ngOnInit() {
    this.data = this.card;
  }
}
