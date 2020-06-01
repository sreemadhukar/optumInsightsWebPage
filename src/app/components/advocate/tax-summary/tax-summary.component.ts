import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatSort, Sort } from '@angular/material/sort';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.scss']
})
export class TaxSummaryComponent implements OnInit {
  @Input() inputData;
  @Output() tinValues = new EventEmitter();
  @Output() showAllTins = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedTaxId;
  tinNameSearch: string;
  taxSummaryData: any;
  data: any;
  taxIdSearch: string;
  numberOfTins: number;
  taxSummaryColumns: string[] = ['TinCheckBox', 'Tin', 'TinName', 'TaxIdType', 'TaxIdOwnership'];
  pageSize = 25;
  pageNumber = 0;
  filterObj = {};
  tinOwnershipSelected = 'Owned';
  allChecked: Boolean = false;
  constructor(private readonly iconRegistry: MatIconRegistry, private readonly sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'arrow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    this.data = { ...this.inputData };
    if (this.data !== null && this.data.All && this.data.All.length) {
      this.numberOfTins = this.data.All.length;
      this.getTaxSummaryData();
      if (this.numberOfTins > 24) {
        this.taxSummaryData.paginator = this.paginator;
        this.customPaginator();
      } else {
        this.taxSummaryData.paginator = null;
      }
      if (this.selectedTaxId[0].Tin !== 'All') {
        this.selectedTaxId.forEach(val => {
          const selectedValue = _.find(this.taxSummaryData.data, { Tin: val.Tin });
          if (this.taxSummaryData.data.indexOf(selectedValue) > -1) {
            selectedValue.checked = true;
            this.taxSummaryData.filteredData.unshift(
              this.taxSummaryData.filteredData.splice(selectedValue.id - 1, 1)[0]
            );
          }
        });
      }
      this.showAllTins.emit(false);
    }
  }

  checkedCount() {
    return _.filter(this.taxSummaryData.filteredData, 'checked').length;
  }
  checkAllSelected() {
    return _.some(this.taxSummaryData.filteredData, function(e) {
      return e.checked;
    });
  }
  swap(index_A, index_B) {
    const temp = this.taxSummaryData.filteredData[index_A];
    this.taxSummaryData.filteredData[index_A] = this.taxSummaryData.filteredData[index_B];
    this.taxSummaryData.filteredData[index_B] = temp;
  }
  // event.target.value is fetching the actual id of the response
  checkBoxChecked(row, index) {
    row.checked = !row.checked;
    if (this.selectedTaxId.length > 0 && this.selectedTaxId[0].Tin === 'All') {
      this.selectedTaxId = [];
    }
    row.checked
      ? this.selectedTaxId.push({
          Tin: row.Tin,
          Tinname: row.TinName
        })
      : this.selectedTaxId.splice(this.selectedTaxId.indexOf(row.Tin), 1);
    this.allChecked = this.selectedTaxId.length > 0 && this.selectedTaxId[0].Tin !== 'All';
    this.tinValues.emit(
      this.selectedTaxId.length > 0 && this.selectedTaxId.length === this.taxSummaryData.data.length
        ? [{ Tin: 'All', Tinname: 'All' }]
        : this.selectedTaxId
    );
    const originalIndex = index + this.paginator.pageIndex * this.pageSize;
    if (row.checked && originalIndex !== this.checkedCount() - 1) {
      this.taxSummaryData.filteredData.unshift(this.taxSummaryData.filteredData.splice(originalIndex, 1)[0]);
    } else if (!row.checked) {
      this.swap(originalIndex, this.checkedCount());
    }
    this.selectedTaxId.length === this.data.All.length ? this.showAllTins.emit(true) : this.showAllTins.emit(false);
    this.taxSummaryData.sort = this.sort;
    const sortState3: Sort = { active: 'TinCheckBox', direction: 'asc' };
    this.sort.active = sortState3.active;
    this.sort.direction = sortState3.direction;
    this.sort.sortChange.emit(sortState3);
    this.taxSummaryData.paginator = this.paginator;
  }

  // function for check all checkboxes
  checkAllChecked() {
    this.allChecked = !this.allChecked;
    const checkSelected = !this.checkAllSelected();
    if (this.allChecked && checkSelected) {
      if (this.selectedTaxId.length > 0 && this.selectedTaxId[0].Tin === 'All') {
        this.selectedTaxId = [];
      }
      for (let i = 0; i < this.taxSummaryData.filteredData.length; i++) {
        this.taxSummaryData.filteredData[i]['checked'] = this.allChecked;
        this.selectedTaxId.push({
          Tin: this.taxSummaryData.filteredData[i].Tin,
          Tinname: this.taxSummaryData.filteredData[i].TinName
        });
      }
      this.selectedTaxId.length === this.data.All.length ? this.showAllTins.emit(true) : this.showAllTins.emit(false);
      this.tinValues.emit(this.selectedTaxId);
    } else {
      for (let i = 0; i < this.taxSummaryData.filteredData.length; i++) {
        this.taxSummaryData.filteredData[i]['checked'] = false;
      }
      this.allChecked = false;
      this.selectedTaxId = [{ Tin: 'All', Tinname: 'All' }];
      this.tinValues.emit(this.selectedTaxId);
    }
  }

  getPageSize(event) {
    this.pageSize = event.pageSize;
  }

  getTaxSummaryData() {
    this.taxSummaryData = new MatTableDataSource(this.data.All);
    this.taxSummaryData.sort = this.sort;
    const sortState: Sort = { active: 'TinCheckBox', direction: 'asc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.searchTaxId('Owned', 'TaxIdOwnership');
    this.taxSummaryData.filterPredicate = data => {
      if (data[this.filterObj['key']] && this.filterObj['key']) {
        return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
      }
      return false;
    };
    this.taxSummaryData = new MatTableDataSource(this.taxSummaryData.data);
    this.taxSummaryData.sort = this.sort;
    const sortState1: Sort = { active: 'TinCheckBox', direction: 'asc' };
    this.sort.active = sortState1.active;
    this.sort.direction = sortState1.direction;
    this.sort.sortChange.emit(sortState1);
    for (let i = 0; i < this.taxSummaryData.filteredData.length; i++) {
      this.taxSummaryData.filteredData[i]['id'] = i + 1;
      this.taxSummaryData.filteredData[i]['checked'] = false;
    }
  }

  searchTaxId(filterValue: string, id: string) {
    this.allChecked = false;
    if (id === 'TinCheckBox') {
      if (filterValue.length > 2 && filterValue.length < 4 && filterValue.search('-') === -1) {
        filterValue = filterValue.slice(0, 2) + '-' + filterValue.slice(2);
      }
      this.taxIdSearch = filterValue;
    }
    if (id === 'TinName') {
      this.tinNameSearch = filterValue;
    }
    if (id === 'Tin') {
      this.taxIdSearch = filterValue;
    }
    this.filterObj = {
      value: filterValue.trim().toLowerCase(),
      key: id
    };
    this.taxSummaryData.filter = filterValue === 'All' ? '' : filterValue.trim().toLowerCase();
    if (this.taxSummaryData.paginator) {
      this.taxSummaryData.paginator.firstPage();
    }
    if (filterValue.length === 0) {
      if (this.checkedCount()) {
        for (let i = 0; i < this.taxSummaryData.filteredData.length; i++) {
          if (this.taxSummaryData.filteredData[i].checked) {
            this.taxSummaryData.filteredData.unshift(
              this.taxSummaryData.filteredData.splice(this.taxSummaryData.filteredData[i].id - 1, 1)[0]
            );
          }
        }
      }

      this.taxSummaryData = new MatTableDataSource(this.data.All);
      this.taxSummaryData.sort = this.sort;
      const sortState2: Sort = { active: 'TinCheckBox', direction: 'asc' };
      this.sort.active = sortState2.active;
      this.sort.direction = sortState2.direction;
      this.sort.sortChange.emit(sortState2);
      this.taxSummaryData.paginator = this.paginator;
    }
  }

  customPaginator() {
    this.paginator._intl.itemsPerPageLabel = 'Display';
    this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
      d3.select('#page-text').text(function() {
        return 'Page ';
      });
      this.pageNumber = page;
      d3.select('#page-number').text(function() {
        return page + 1;
      });
      return ' of ' + Math.floor(length / pageSize + 1);
    };

    d3.select('.mat-paginator-container')
      .insert('div')
      .text('per page')
      .style('flex-grow', '5')
      .lower();

    d3.select('.mat-paginator-range-label')
      .insert('div')
      .style('border', 'solid 1px')
      .style('border-radius', '2px')
      .style('float', 'left')
      .style('margin', '-13px 5px 0px 5px')
      .style('padding', '10px 20px 10px 20px')
      .attr('id', 'page-number')
      .lower();

    d3.select('.mat-paginator-range-label')
      .insert('span')
      .style('float', 'left')
      .lower()
      .attr('id', 'page-text');
  }

  clearValue(value: string) {
    if (value === 'taxIdSearch') {
      this.taxIdSearch = '';
    }
    if (value === 'tinNameSearch') {
      this.tinNameSearch = '';
    }
  }
}
