import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  selected: string;
  itemsList = [
    { value: 'ProviderSystem', viewValue: 'Health System Name' },
    { value: 'Tin', viewValue: 'Tax Id Number' },
    { value: 'TinName', viewValue: 'Tax Id Name' }
  ];
  constructor() {}

  ngOnInit() {
    this.selected = this.itemsList[0].value;
  }
}
