import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss']
})
export class TrendsComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit() {}
}
