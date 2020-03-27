import { Component, AfterContentInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-large-card-advocate',
  templateUrl: './large-card-advocate.component.html',
  styleUrls: ['./large-card-advocate.component.scss']
})
export class LargeCardAdvocateComponent implements AfterViewInit {
  @Input() data: any;
  @Input() appealsLineGraph: any;

  constructor() {}

  ngAfterViewInit() {}
}
