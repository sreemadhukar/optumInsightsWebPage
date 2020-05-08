import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatSort, Sort } from '@angular/material/sort';
import * as d3 from 'd3';

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.scss']
})
export class TaxSummaryComponent implements OnInit {
  @Input() data;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  taxSummaryData: any;
  numberOfTins: any;
  taxSummaryColumns: string[] = ['TinCheckBox', 'Tin', 'TinName', 'TaxIdType', 'TaxIdOwnership'];
  pageSize = 25;
  filterObj = {};
  tinOwnershipSelected = 'Owned';
  allChecked: Boolean = false;
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private healthSystemDetailsSharedService: HealthSystemDetailsSharedService
  ) {
    this.iconRegistry.addSvgIcon(
      'arrow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg'
      )
    );
  }

  ngOnInit() {
    if (this.data !== null) {
      this.getTaxSummaryData();
      if (this.numberOfTins > 24) {
        this.customPaginator();
      } else {
        this.taxSummaryData.paginator = null;
      }
    }
    const serializedState = JSON.parse(sessionStorage.getItem('state'));
    this.taxSummaryData.filteredData.forEach(value => {
      serializedState.taxId.forEach(val => {
        if (val.Tin !== 'All' && val.Tin === value.Tin) {
          value.checked = true;
          this.healthSystemDetailsSharedService.sharedParams.push({
            Tin: value.Tin,
            Tinname: value.TinName,
            number: parseInt(value.Tin.replace('-', ''))
          });
        }
      });
    });
  }
  checkAllChecked() {
    this.allChecked = !this.allChecked;
    for (let i = 0; i < this.data.All.length; i++) {
      this.data.All[i]['checked'] = this.allChecked;
    }
    this.healthSystemDetailsSharedService.sharedParams = [];
    if (this.allChecked) {
      this.healthSystemDetailsSharedService.sharedParams = this.data.All.map(item => item.Tin);
    }
  }
  // event.target.value is fetching the actual id of the response
  checkBoxChecked(row) {
    row.checked = !row.checked;
    row.checked
      ? this.healthSystemDetailsSharedService.sharedParams.push({
          Tin: row.Tin,
          Tinname: row.TinName,
          number: parseInt(row.Tin.replace('-', ''))
        })
      : this.healthSystemDetailsSharedService.sharedParams.splice(
          this.healthSystemDetailsSharedService.sharedParams.indexOf(row.Tin),
          1
        );
  }
  getPageSize(event) {
    this.pageSize = event.pageSize;
  }

  getTaxSummaryData() {
    if (this.data.All && this.data.All.length > 0) {
      for (let i = 0; i < this.data.All.length; i++) {
        this.data.All[i]['id'] = i + 1;
        this.data.All[i]['checked'] = false;
      }
      this.numberOfTins = this.data.All.length;
      this.taxSummaryData = new MatTableDataSource(this.data.All);
      this.taxSummaryData.sort = this.sort;

      const sortState: Sort = { active: 'Tin', direction: 'asc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
      this.taxSummaryData.filterPredicate = data => {
        if (data[this.filterObj['key']] && this.filterObj['key']) {
          return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
        }
        return false;
      };
    }
  }

  searchTaxId(filterValue: string, id: string) {
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
    this.taxSummaryData.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Display';
    this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
      d3.select('#page-text').text(function() {
        return 'Page ';
      });
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
