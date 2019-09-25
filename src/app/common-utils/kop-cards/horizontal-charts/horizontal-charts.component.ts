import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-charts',
  templateUrl: './horizontal-charts.component.html',
  styleUrls: ['./horizontal-charts.component.scss']
})
export class HorizontalChartsComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
