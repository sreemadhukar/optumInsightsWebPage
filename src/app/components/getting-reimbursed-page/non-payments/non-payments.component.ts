import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry, PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { GlossaryExpandService } from '../../../shared/glossary-expand.service';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NonPaymentsComponent implements OnInit {
  title = 'Top Reasons for Claims Non-Payment';
  trendTitle = 'Claims Non-Payment Trend';
  facilityTitle = 'Claims Non-Payments by Facility';
  timePeriod = 'Last 6 Months';
  section: any = [];
  summaryItems: any;
  pageTitle: String = '';
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  monthlyLineGraph: any = [{}];
  recordsMorethan10 = true;
  showPagination = true;
  displayedColumns: string[] = ['facilityName'];
  pageNumber = 1;
  totalPages = 0;
  totalRecords: any = 0;
  top5ReasonsDataArray: any;
  top5Reasons: any = [];
  facilityData: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  barChartsArray = [
    {
      title: 'Need More Information',
      value: '$2.6M',
      numeric: 2600000,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Auth Notice Ref',
      value: '$999.9K',
      numeric: 999900,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Claims Payment Policy',
      value: '$754.8K',
      numeric: 754800,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Benefit Coverage',
      value: '$354.2K',
      numeric: 354200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Not Categorized',
      value: '$232.2K',
      numeric: 232200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    }
  ];

  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private gettingReimbursedSharedService: GettingReimbursedSharedService,
    private cdRef: ChangeDetectorRef,
    private glossaryExpandService: GlossaryExpandService,
    private session: SessionService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'open',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
    this.pageTitle = 'Claims Non-Payments';
  }

  ngOnInit() {
    this.timePeriod = this.session.timeFrame;
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[2].data;
      this.currentTabTitle = this.summaryItems[2].title;
    });
    this.monthlyLineGraph.chartId = 'non-payment-trend-block';
    this.monthlyLineGraph.titleData = [{}];
    this.monthlyLineGraph.generalData = [
      {
        width: 500,
        backgroundColor: 'null',
        barGraphNumberSize: 18,
        barColor: '#196ECF',
        parentDiv: 'non-payment-trend-block',
        tooltipBoolean: true,
        hideYAxis: false
      }
    ];
    this.monthlyLineGraph.chartData = [
      { name: 'Nov', value: 1360834 },
      { name: 'Dec', value: 2260634 },
      { name: 'Jan', value: 3160834 },
      { name: 'Feb', value: 3076756 },
      { name: 'Mar', value: 2076756 },
      { name: 'Apr', value: 1000078 }
    ];
    this.monthlyLineGraph.generalData2 = [];
    this.monthlyLineGraph.chartData2 = [];
    this.gettingReimbursedSharedService.getTopReasonsforClaimsNonPayments().then(topReasons => {
      this.top5ReasonsDataArray = topReasons;
      this.top5ReasonsDataArray.forEach(element => {
        this.displayedColumns.push(element.Claimdenialcategorylevel1shortname);
        this.top5Reasons.push(element.Claimdenialcategorylevel1shortname);
      });
    });
    this.gettingReimbursedSharedService
      .getClaimsNonPaymentsbyFacilityData(this.top5Reasons)
      .then(claimsNonpaymentsData => {
        this.facilityData = claimsNonpaymentsData;
        if (this.facilityData.length === 0) {
          this.showPagination = false;
        }
        this.dataSource = new MatTableDataSource(this.facilityData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'facilityName':
              return item.facilityName + item.tin;
            default:
              return item[property];
          }
        };
        this.dataSource.sort = this.sort;
        this.totalRecords = this.facilityData.length;

        if (this.facilityData.length <= 10) {
          this.recordsMorethan10 = false;
        } else {
          this.totalPages = Math.ceil(this.totalRecords / 10);
        }
      });
  }
  syncPrimaryPaginator(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
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
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
