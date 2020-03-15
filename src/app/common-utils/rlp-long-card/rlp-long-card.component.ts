import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rlp-long-card',
  templateUrl: './rlp-long-card.component.html',
  styleUrls: ['./rlp-long-card.component.scss']
})
export class RlpLongCardComponent implements OnInit {
  @Input() config;

  constructor() {}

  ngOnInit() {}
}
