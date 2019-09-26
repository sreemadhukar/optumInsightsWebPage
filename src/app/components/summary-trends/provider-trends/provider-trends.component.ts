import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatIconRegistry } from '@angular/material';
import { SummaryTrendsSharedService } from '../../../shared/summary-trends/summary-trends-shared.service';
import { SessionService } from '../../../shared/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-provider-trends',
  templateUrl: './provider-trends.component.html',
  styleUrls: ['./provider-trends.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProviderTrendsComponent implements OnInit {
  pageTitle = 'Metrics Report';
  data = [];
  displayedColumns: string[] = [];
  dataSource: any;
  data_date: any;
  metric: any;
  loading = true;
  previous_date: any = new Date();
  filterUrl = '/AdminSummaryTrends';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private summaryTrends: SummaryTrendsSharedService,
    private session: SessionService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private filterExpandService: FilterExpandService,
    private common: CommonUtilsService
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
  }
  ngOnInit() {
    this.getSummaryData();
    this.data_date = this.session.filterObjValue.date;
    this.metric = this.session.filterObjValue.metric;
    const newDate = this.data_date;
    this.previous_date = this.previous_date.setDate(newDate.getDate() - 1).toString();
  }

  getSummaryData() {
    this.summaryTrends.sharedSummaryTrends().then(r => {
      const result: any = r;
      if (result) {
        this.data = result.dataSource;
        this.displayedColumns = result.displayedColumns;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
}
