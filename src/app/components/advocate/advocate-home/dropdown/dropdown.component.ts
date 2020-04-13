import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() dropdownList;
  @Output() valueChange = new EventEmitter();
  selected: string;
  itemsList: any;
  constructor() {}

  ngOnInit() {
    this.itemsList = this.dropdownList;
    this.selected = this.itemsList[0].value;
  }
  doSomething(val) {
    this.valueChange.emit(val);
  }
}
