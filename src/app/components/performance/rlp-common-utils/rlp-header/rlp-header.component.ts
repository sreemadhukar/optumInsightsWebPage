import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rlp-header',
  templateUrl: './rlp-header.component.html',
  styleUrls: ['./rlp-header.component.scss']
})
export class RlpHeaderComponent implements OnInit {
  @Input() rlpTitle;
  @Input() rlpSubTitle;

  constructor() {}

  ngOnInit() {}
}
