import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { SummaryTrendsSharedService } from 'src/app/shared/summary-trends/summary-trends-shared.service';
import { SessionService } from 'src/app/shared/session.service';

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private summaryTrends: SummaryTrendsSharedService, private session: SessionService) {}
  ngOnInit() {
    this.getSummaryData();
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
    });
  }

  formattingText(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
