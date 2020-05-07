import { Component, Input } from '@angular/core';

export interface Link {
  title: string;
  path: string;
}

@Component({
  selector: 'app-page-header',
  templateUrl: './page_header.component.html',
  styleUrls: ['./page_header.component.scss']
})
export class PageHeaderComponent {
  @Input() pageTitle: string;
  @Input() pageSubTitle: string;
  @Input() pageSubTitleDescription: string;
  @Input() print: boolean;
  @Input() link: Link;
  constructor() {}
}
