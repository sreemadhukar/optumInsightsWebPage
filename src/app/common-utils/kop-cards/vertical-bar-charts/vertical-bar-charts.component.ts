import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vertical-bar-charts',
  templateUrl: './vertical-bar-charts.component.html',
  styleUrls: ['./vertical-bar-charts.component.scss']
})
export class VerticalBarChartsComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
