import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  @Input() tinsData: any;
  @Input() tinValue: any;
  @Input() taxData: any;
  @Output() taxArray = new EventEmitter();
  public taxArrayData = '';
  public fileterdArray: any;
  public searchControl: FormControl;
  public selectedArray: Array<any> = [];
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'done',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-done-24px.svg')
    );
  }

  ngOnInit() {
    if (this.taxData !== 'All') {
      this.taxArrayData = this.taxData;
      this.tinsData.forEach(value => {
        if (this.taxArrayData.includes(value['Tin'])) {
          this.selectedArray.push(value);
          value['checked'] = true;
        }
      });
    }
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.subscribe(query => {
      this.fileterdArray = this.tinsData.filter(function(tag) {
        return tag.Tin.indexOf(query) >= 0;
      });
      // .slice(0, 5);
    });
  }

  selectedItem(item) {
    if (!this.selectedArray.includes(item)) {
      this.selectedArray.push(item);
      if (this.taxArrayData === '') {
        this.taxArrayData = item.Tin;
      } else {
        this.taxArrayData += ', ' + item.Tin;
      }
      this.taxArray.emit(this.taxArrayData);
      this.tinsData.forEach(value => {
        if (value['Tin'] === item.Tin) {
          value['checked'] = true;
        }
      });
    }
  }

  onRemove(item) {
    if (this.selectedArray.includes(item)) {
      if (this.taxArrayData.includes(item.Tin + ', ')) {
        this.taxArrayData = this.taxArrayData.replace(item.Tin + ', ', '');
      } else if (this.taxArrayData.includes(', ' + item.Tin)) {
        this.taxArrayData = this.taxArrayData.replace(', ' + item.Tin, '');
      } else {
        this.taxArrayData = this.taxArrayData.replace(item.Tin, '');
      }
      if (this.taxArrayData) {
        this.taxArray.emit(this.taxArrayData);
      } else {
        this.taxArray.emit('All');
      }
      this.selectedArray = this.selectedArray.filter(tin => tin !== item);
      this.tinsData.forEach(value => {
        if (value['Tin'] === item.Tin) {
          value['checked'] = false;
        }
      });
    }
  }
}
