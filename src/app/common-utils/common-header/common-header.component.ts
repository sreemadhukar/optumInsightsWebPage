import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  @Input() cardType: String;
  titleHeader: String = null;
  typeOfCard: String = null;
  constructor() {}

  ngOnInit() {
    this.titleHeader = this.title;
    this.typeOfCard = this.cardType;
  }
  getMetricDetails(titleHeader) {
    console.log(titleHeader);
  }
}
