import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  @Output() helpIconClicked = new EventEmitter();
  @Input() cardType: String;
  titleHeader: String = null;
  typeOfCard: String = null;
  constructor() {}

  ngOnInit() {
    this.titleHeader = this.title;
    this.typeOfCard = this.cardType;
  }
  helpFunctionClicked() {
    this.helpIconClicked.emit(this.title);
  }
}
