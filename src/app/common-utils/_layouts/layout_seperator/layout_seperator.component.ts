import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layoutseperator',
  templateUrl: './layout_seperator.component.html',
  styleUrls: ['./layout_seperator.component.scss']
})
export class LayoutSeparatorComponent {
  @Input() height: string;
  constructor() {}
}
