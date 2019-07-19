import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;

  timePeriodFooter: String = null;

  constructor() {}

  ngOnInit() {
    this.timePeriodFooter = this.timePeriod;
  }
}
