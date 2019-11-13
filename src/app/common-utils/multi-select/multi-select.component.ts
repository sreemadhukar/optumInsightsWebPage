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
      // Adding - to the query as tin
      const tinPart1 = query.slice(0, 2);
      const tinPart2 = query.slice(2, query.length);
      let tin = query;
      if (query.length > 2) {
        tin = tinPart1 + '-' + tinPart2;
      }

      const filteredTinsData = this.tinsData.filter(function(tag) {
        return tag.Tin.slice(0, tin.length) === tin;
      });
      const nonFilteredTinsData = this.tinsData.filter(function(tag) {
        return tag.Tin.slice(0, tin.length) !== tin;
      });

      this.fileterdArray = filteredTinsData.concat(nonFilteredTinsData);
      // .slice(0, 5);
    });

    // Creating Number From Tin Number and Sorting All Tins
    this.tinsData.map((element: any) => {
      element.number = parseInt(element.Tin.replace('-', ''));
      return element;
    });
    this.tinsData.sort(this.sortOrder('number'));
  }

  sortOrder(prop) {
    return (a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
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
