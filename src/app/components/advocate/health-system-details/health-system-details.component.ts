import { Component, OnInit, ViewChild } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router, NavigationStart } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { SessionService } from '../../../shared/session.service';
import { MatSort, Sort } from '@angular/material/sort';
import * as d3 from 'd3';

@Component({
  selector: 'app-health-system-details',
  templateUrl: './health-system-details.component.html',
  styleUrls: ['./health-system-details.component.scss']
})
export class HealthSystemDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataLoading: boolean;
  healthSystemData: any;
  subscription: any;
  tinsData: any;
  taxSummaryData: any;
  numberOfTins: any;
  taxSummaryColumns: string[] = ['Tin', 'TinName', 'TaxIdType', 'MajorMarketName'];
  length: number;
  pageSize = 25;

  constructor(
    private healthSystemService: HealthSystemDetailsSharedService,
    private checkStorage: StorageService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private session: SessionService,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'backButton',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/TIN-List-Back-Button-Icon.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/info-24px.svg'));
    iconRegistry.addSvgIcon(
      'downarrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/arrow_downward-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.getHealthSystemDetails();
  }

  getHealthSystemDetails() {
    this.dataLoading = true;
    this.healthSystemService
      .getHealthSystemData()
      .then(healthSystemData => {
        this.dataLoading = false;
        this.healthSystemData = JSON.parse(JSON.stringify(healthSystemData));
        if (this.healthSystemData !== null) {
          this.getTaxSummaryData();
          if (this.numberOfTins > 24) {
            this.customPaginator();
          } else {
            this.taxSummaryData.paginator = null;
          }
        }
      })
      .catch(reason => {
        this.dataLoading = false;
        console.log('Health System Details are not available', reason);
      });
  }

  viewInsights() {
    this.router.navigate(['/OverviewPageAdvocate']);
  }

  pageEventTest(event) {
    this.pageSize = event.pageSize;
  }

  getTaxSummaryData() {
    if (this.healthSystemData.All && this.healthSystemData.All.length > 0) {
      this.tinsData = this.healthSystemData.All;
      this.numberOfTins = this.tinsData.length;
      this.taxSummaryData = new MatTableDataSource(this.tinsData);
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
