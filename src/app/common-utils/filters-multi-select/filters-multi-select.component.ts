import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-filters-multi-select',
  templateUrl: './filters-multi-select.component.html',
  styleUrls: ['./filters-multi-select.component.scss']
})
export class FiltersMultiSelectComponent implements OnInit {
  @Input() tinsData: any;
  @Output() taxArray = new EventEmitter();
  public filteredArray: any;
  public searchControl: FormControl;
  public selectedArray: Array<any> = [];
  showTin = false;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'done',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-done-24px.svg')
    );
  }

  ngOnInit() {
    this.searchControl = new FormControl('');
    this.tinsData.forEach(val => {
      if (val.checked === true) {
        this.selectedArray.push(val);
      }
    });
    this.searchControl.valueChanges.subscribe(query => {
      this.filteredArray = this.tinsData.filter(function(tag) {
        return tag.Tin.indexOf(query) >= 0;
      });
    });
    if (this.selectedArray.length > 0) {
      this.filteredArray = this.tinsData;
    }
  }

  selectedItem(item) {
    if (!this.selectedArray.includes(item)) {
      this.selectedArray.push(item);
      this.taxArray.emit(this.selectedArray);
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
      if (this.selectedArray.length > 0) {
        this.taxArray.emit(this.selectedArray);
      } else {
        this.taxArray.emit([{ Tin: 'All', Tinname: 'All' }]);
      }
      this.tinsData.forEach(value => {
        if (value['Tin'] === item.Tin) {
          value['checked'] = false;
        }
      });
    }
  }
}
