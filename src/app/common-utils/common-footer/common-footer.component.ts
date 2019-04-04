import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.less']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;
  constructor() {}

  ngOnInit() {}
}
