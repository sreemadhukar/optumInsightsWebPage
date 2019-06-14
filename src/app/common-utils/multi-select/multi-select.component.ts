import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  @Input() tinsData: any;
  public fileterdArray: any;
  public searchControl: FormControl;
  public selectedArray = [];

  constructor() {}

  ngOnInit() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.subscribe(query => {
      console.log(query);
      this.fileterdArray = this.tinsData.filter(function(tag) {
        return tag.Tin.indexOf(query) >= 0;
      });
      console.log(this.fileterdArray);
    });
  }

  selectedItem(item) {
    if (!this.selectedArray.includes(item)) {
      this.selectedArray.push(item);
      this.tinsData.forEach(value => {
        if (value['Tin'] === item.Tin) {
          value['checked'] = true;
        }
      });
    }
  }

  onRemove(item) {
    if (this.selectedArray.includes(item)) {
      this.selectedArray = this.selectedArray.filter(tin => tin !== item);
    }
  }
}
