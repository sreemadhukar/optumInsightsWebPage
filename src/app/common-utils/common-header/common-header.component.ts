import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  titleHeader: String = null;
  constructor() {}

  ngOnInit() {
    this.titleHeader = this.title;
  }
  getMetricDetails(titleHeader) {
    console.log(titleHeader);
  }
}
