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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedTaxId;
  taxSummaryData: any;
  data: any;
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
    }
    if (this.selectedTaxId && this.selectedTaxId.length) {
      if (this.selectedTaxId[0].Tin !== 'All') {
        this.selectedTaxId.forEach(val => {
          const selectedValue = _.find(this.taxSummaryData.data, { Tin: val.Tin });
          if (this.taxSummaryData.data.indexOf(selectedValue) > -1) {
            selectedValue.checked = true;
          }
        });
      }
    }
  }

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
      this.selectedTaxId =
        this.selectedTaxId.length === this.data.All.length ? [{ Tin: 'All', Tinname: 'All' }] : this.selectedTaxId;
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
  moveCheckedTin(index: number) {
    this.taxSummaryData.filteredData.unshift(this.taxSummaryData.filteredData.splice(index, 1)[0]);
    this.taxSummaryData = new MatTableDataSource(this.taxSummaryData.filteredData);
  }
  moveUnCheckedTin(index: number, checkedCount: number) {
    this.swap(index, checkedCount);
    this.taxSummaryData = new MatTableDataSource(this.taxSummaryData.filteredData);
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
    const orignalIndex = index + this.paginator.pageIndex * this.pageSize;
    if (row.checked && orignalIndex !== this.checkedCount() - 1) {
      this.moveCheckedTin(orignalIndex);
    } else if (!row.checked) {
      this.moveUnCheckedTin(orignalIndex, this.checkedCount());
    }
    this.taxSummaryData.paginator = this.paginator;
  }

  getPageSize(event) {
    this.pageSize = event.pageSize;
  }

  getTaxSummaryData() {
    this.taxSummaryData = new MatTableDataSource(this.data.All);
    this.taxSummaryData.sort = this.sort;
    const sortState: Sort = { active: 'Tin', direction: 'asc' };
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
    for (let i = 0; i < this.taxSummaryData.filteredData.length; i++) {
      this.taxSummaryData.filteredData[i]['id'] = i + 1;
      this.taxSummaryData.filteredData[i]['checked'] = false;
    }
  }

  searchTaxId(filterValue: string, id: string) {
    this.allChecked = false;
    this.filterObj = {
      value: filterValue.trim().toLowerCase(),
      key: id
    };
    this.taxSummaryData.filter = filterValue === 'All' ? '' : filterValue.trim().toLowerCase();
    if (this.taxSummaryData.paginator) {
      this.taxSummaryData.paginator.firstPage();
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
}
