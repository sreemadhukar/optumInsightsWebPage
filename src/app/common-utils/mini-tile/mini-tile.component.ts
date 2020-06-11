import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mini-tile',
  templateUrl: './mini-tile.component.html',
  styleUrls: ['./mini-tile.component.scss']
})
export class MiniTileComponent implements OnInit {
  @Input() data;
  @Input() skeleton;
  public printStyle: boolean;
  constructor(private router: Router) {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }

  ngOnInit() {}
}
