import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layoutcontainer',
  templateUrl: './layoutcontainer.component.html',
  styleUrls: ['./layoutcontainer.component.scss']
})
export class LayoutContainerComponent {
  @Input() print;
  constructor() {}
}
