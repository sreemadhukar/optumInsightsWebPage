import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatIconRegistry, PageEvent } from '@angular/material';
import { SummaryTrendsSharedService } from '../../../shared/summary-trends/summary-trends-shared.service';
import { SessionService } from '../../../shared/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { IAppState } from '../../../store/store';
import { NgRedux } from '@angular-redux/store';

@Component({
  selector: 'app-provider-trends',
  templateUrl: './provider-trends.component.html',
  styleUrls: ['./provider-trends.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProviderTrendsComponent implements OnInit, AfterViewChecked {
  pageTitle = 'Summary Trends';
  data = [];
  displayedColumns: string[] = [];
  dataSource: any;
  data_date: any;
  metric: any;
  loading = true;
  previous_date: any = new Date();
  showPagination = true;
  totalRecords: any = 0;
  pageNumber = 1;
  totalPages = 0;
  pageSize = 10;
  filterUrl = '/AdminSummaryTrends';
  sortDirection = 'ASC';
  sortColumn = 'ProviderSysKey';
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  dataloading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private summaryTrends: SummaryTrendsSharedService,
    private session: SessionService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private filterExpandService: FilterExpandService,
    private common: CommonUtilsService,
    private cdRef: ChangeDetectorRef,
    private ngRedux: NgRedux<IAppState>
  ) {
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    iconRegistry.addSvgIcon('trending_up', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/trend-up.svg'));
    iconRegistry.addSvgIcon(
      'trending_down',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/trend-down.svg')
    );
    iconRegistry.addSvgIcon(
      'trending_up_red',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/up-negative-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'trending_down_green',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/down-positive-no-circle.svg')
    );
    iconRegistry.addSvgIcon(
      'trending_flat',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/trending_flat-24px.svg')
    );

    this.summaryTrends.sharedSummaryTrendsCount().then(r => {
      const result: any = r;
      if (result) {
        this.totalRecords = result;
        this.paginator.length = result;
      }
    });
  }
  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'summaryTrendsPage' });
    this.getSummaryData();
    this.data_date = this.session.filterObjValue.date;
    this.metric = this.session.filterObjValue.metric;
    const newDate = this.data_date;
    this.previous_date = new Date(newDate.toString());
    this.previous_date = this.previous_date.setDate(newDate.getDate() - 1);
  }

  ngAfterViewChecked() {
    this.totalPages = this.paginator.getNumberOfPages();
    // this.totalRecords = this.paginator.length;
    this.cdRef.detectChanges();
  }
  getSummaryData() {
    this.sortColumn = 'ProviderSysKey';
    this.sortDirection = 'ASC';
    this.summaryTrends.sharedSummaryTrends(1, 10, this.sortColumn, this.sortDirection).then(r => {
      const result: any = r;
      console.log(result);
      if (result) {
        this.data = result.dataSource;
        this.displayedColumns = result.displayedColumns;
        // this.totalRecords = result.totalRecordsCount;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
        // this.paginator.length = result.totalRecordsCount;
      }
      this.loading = false;
    });
  }

  formattingText(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  openFilter() {
    // this.filterExpandService.setURL(this.router.url);
    this.filterExpandService.setURL(this.filterUrl);
  }

  getData(item) {
    return item + 'Varince';
  }

  formatNumber(num) {
    if (num) {
      return this.common.nFormatter(num);
    } else {
      return 0;
    }
  }

  syncPrimaryPaginator(event: PageEvent) {
    this.dataloading = true;
    this.pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.summaryTrends.sharedSummaryTrends(this.pageNumber, pageSize, this.sortColumn, this.sortDirection).then(r => {
      const result: any = r;
      if (result) {
        this.data = result.dataSource;
        this.displayedColumns = result.displayedColumns;
        // this.totalRecords = result.totalRecordsCount;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
      }
      this.dataloading = false;
    });
  }
  changePagination(event) {
    this.paginator.pageSize = Number(event.target.value);
    this.paginator.page.emit({
      previousPageIndex: 2,
      pageIndex: 1,
      pageSize: event.target.value,
      length: this.paginator.length
    });
    this.paginator.firstPage();
    this.pageNumber = 1;
    this.totalPages = this.paginator.getNumberOfPages();
  }
  changePage() {
    (this.paginator.pageIndex = this.pageNumber - 1), // number of the page you want to jump.
      this.paginator.page.next({
        pageIndex: this.pageNumber - 1,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
  }
  sortData(event) {
    this.dataloading = true;
    let column = event.active;
    const direction = event.direction;
    if (column !== 'ProviderName') {
      column = column + 'Varince';
    } else {
      column = 'ProviderOrganisationName';
    }
    this.sortDirection = direction.toUpperCase();
    this.sortColumn = column;
    this.summaryTrends
      .sharedSummaryTrends(this.pageNumber, this.pageSize, this.sortColumn, this.sortDirection)
      .then(r => {
        const result: any = r;
        if (result) {
          this.data = result.dataSource;
          this.displayedColumns = result.displayedColumns;
          // this.totalRecords = result.totalRecordsCount;
          this.dataSource = new MatTableDataSource(this.data);
          // this.dataSource.sort = this.sort;
        }
        this.dataloading = false;
      });
  }
  checkColumn(item) {
    if (
      item === 'TotalClaimsNotPaid' ||
      item === 'DeniedAmount' ||
      item === 'NonPaymentRate' ||
      item === 'TotalAppeals' ||
      item === 'AdminAppeals' ||
      item === 'ClinicalAppeals' ||
      item === 'TotalCallsByType' ||
      item === 'TotalTalkTimeByCallType' ||
      item === 'PriorAuthNotApprovedCount' ||
      item === 'TotalPaRequested' ||
      item === 'UrgentTat' ||
      item === 'PaApprovalRate'
    ) {
      return false;
    } else {
      return true;
    }
  }
}
