import { Component, OnInit, Output, HostListener, EventEmitter, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';
import { Observable } from 'rxjs';
import { FILTER_MASTER_DATA } from 'src/app/store/kopFilter/kopFilterMasterData';
import { NgRedux, select } from '@angular-redux/store';
import { APPLY_KOP_FILTER, RESET_KOP_FILTER } from 'src/app/store/kopFilter/actions';

export interface FilterData {
  title: string;
  selected: boolean;
  default: boolean;
}

export interface FilterOptions {
  title: string;
  default: boolean;
  selected: boolean;
  quarterFormat: string;
  timeFrameFormat: string;
  filters: string[];
  priorAuthFilters: string[];
}

@Component({
  selector: 'app-uhc-kop-filter',
  templateUrl: './uhc-kop-filter.component.html',
  styleUrls: ['./uhc-kop-filter.component.scss']
})
export class UhcKopFilterComponent implements OnInit {
  @Output() filterFlag = new EventEmitter();
  @Input() customFilter;

  public filterMasterData = FILTER_MASTER_DATA;

  public selectedFilter: any;
  filteredOptions: Observable<any[]>;

  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private ngRedux: NgRedux<any>
  ) {}

  ngOnInit() {
    const currentFilterState = this.ngRedux.getState();
    this.selectedFilter = currentFilterState['kop']['timePeriod'];
  }

  resetFilter() {
    if (this.customFilter) {
      this.ngRedux.dispatch({ type: RESET_KOP_FILTER });
    }
    this.filterFlag.emit(false);
  }

  applyFilter() {
    if (this.customFilter) {
      this.ngRedux.dispatch({ type: APPLY_KOP_FILTER, timePeriod: this.selectedFilter });
    }

    this.filterFlag.emit(false);
  }
  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.filterFlag.emit(false);
  }
}
