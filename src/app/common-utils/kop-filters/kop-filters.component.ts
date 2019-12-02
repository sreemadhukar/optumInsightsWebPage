import { Component, OnInit, Output, HostListener, EventEmitter, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material';

export interface FilterData {
  title: string;
  selected: boolean;
  default: boolean;
}

@Component({
  selector: 'app-kop-filters',
  templateUrl: './kop-filters.component.html',
  styleUrls: ['./kop-filters.component.scss']
})
export class KopFiltersComponent implements OnInit {
  public selectedFilter: any;
  // public filterData: any;
  filteredOptions: Observable<any[]>;
  public serviceCategoryCtrl = new FormControl();

  @Output() filterFlag = new EventEmitter();
  @Input() filterurl;
  @Input() customFilter;
  @Input() filterData: FilterData[] = [];

  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private session: SessionService) {}

  ngOnInit() {
    this.selectedFilter = this.filterData.filter(element => element.selected)[0].title;
  }

  resetFilter() {
    if (this.customFilter) {
      this.filterData.forEach((filterDataItem: FilterData) => {
        const { default: defaultFilter } = filterDataItem;
        filterDataItem.selected = false;
        if (defaultFilter) {
          this.selectedFilter = filterDataItem.title;
          filterDataItem.selected = true;
        }
      });
      this.session.store({
        selectedFilter: this.selectedFilter
      });
    }
    this.filterFlag.emit(false);
  }

  applyFilter() {
    if (this.customFilter) {
      this.session.store({
        selectedFilter: this.selectedFilter
      });
    }
    // this.session.filterObjSubject.complete();
    this.filterFlag.emit(false);
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.filterFlag.emit(false);
  }
}
