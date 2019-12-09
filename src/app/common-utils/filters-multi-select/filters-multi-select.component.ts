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

      this.filteredArray = filteredTinsData.concat(nonFilteredTinsData);
      // .slice(0, 5);
    });

    // Creating Number From Tin Number and Sorting All Tins
    this.tinsData.map((element: any) => {
      element.number = parseInt(element.Tin.replace('-', ''));
      return element;
    });
    this.tinsData.sort(this.sortOrder('number'));

    if (this.selectedArray.length > 0) {
      this.filteredArray = this.tinsData;
    }
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
