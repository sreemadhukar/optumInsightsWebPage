import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mini-tile',
  templateUrl: './mini-tile.component.html',
  styleUrls: ['./mini-tile.component.scss']
})
export class MiniTileComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit() {}
}
