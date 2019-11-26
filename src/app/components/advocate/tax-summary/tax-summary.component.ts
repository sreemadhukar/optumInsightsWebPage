import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SessionService } from '../../../shared/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatSort, Sort } from '@angular/material/sort';
import * as d3 from 'd3';
import { StorageService } from '../../../shared/storage-service.service';

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
  taxSummaryColumns: string[] = ['Tin', 'TinName', 'TaxIdType', 'MajorMarketName'];
  pageSize = 25;

  constructor(
    private iconRegistry: MatIconRegistry,
    private session: SessionService,
    private checkStorage: StorageService,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
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
  }

  getPageSize(event) {
    this.pageSize = event.pageSize;
  }

  getTaxSummaryData() {
    if (this.data.All && this.data.All.length > 0) {
      this.numberOfTins = this.data.All.length;
      this.taxSummaryData = new MatTableDataSource(this.data.All);
      this.taxSummaryData.sort = this.sort;
      const sortState: Sort = { active: 'Tin', direction: 'asc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
  }

  searchTaxId(filterValue) {
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
