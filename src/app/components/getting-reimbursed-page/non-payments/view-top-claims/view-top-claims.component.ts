import { CommonUtilsService } from './../../../../shared/common-utils.service';
import { StorageService } from './../../../../shared/storage-service.service';
import { NonPaymentSharedService } from './../../../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { CreatePayloadService } from './../../../../shared/uhci-filters/create-payload.service';

import { SessionService } from './../../../../shared/session.service';
import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';

import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, REMOVE_FILTER } from './../../../../store/filter/actions';
import { NgRedux, select } from '@angular-redux/store';
import { Router, NavigationStart } from '@angular/router';
import { IAppState } from './../../../../store/store';
import * as d3 from 'd3';
import { TopClaimsSharedService } from './../../../../shared/getting-reimbursed/non-payments/top-claims-shared.service';
import { TopReasonsEmitterService } from './../../../../shared/getting-reimbursed/non-payments/top-reasons-emitter.service';

@Component({
  selector: 'app-view-top-claims',
  templateUrl: './view-top-claims.component.html',
  styleUrls: ['./view-top-claims.component.scss']
})
export class ViewTopClaimsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedclaims: any;
  numberOfClaims: any;
  tinsDisplayedColumns: string[] = [
    'TinNameAndNumber',
    'ProviderName',
    'NonPaymentAmount',
    'BilldedAmount',
    'DateOfProcessing',
    'ClaimNumber'
  ];
  dataSource: MatTableDataSource<any>;
  pageSize = 25;
  filterObj = {};
  subscription: any;
  ProviderSysKey: any;

  providerName: string;
  public viewsClaimsFullData: any;
  tinsData: any;

  previousPage: any;

  public clickSubReason: Subscription;
  tableViewData: any;
  claimsData: Array<Object> = [{}];
  previousPageurl = [
    { previousPage: 'overviewPage', urlRout: '/OverviewPage' },
    { previousPage: 'gettingReimbursedSummary', urlRout: '/GettingReimbursed' },
    { previousPage: 'paymentsPage', urlRout: '/GettingReimbursed/Payments' },
    { previousPage: 'nonPaymentsPage', urlRout: '/GettingReimbursed/NonPayments' },
    { previousPage: 'appealsPage', urlRout: '/GettingReimbursed/Appeals' },
    { previousPage: 'paymentIntegrityPag', urlRout: '/GettingReimbursed/PaymentIntegrity' },
    { previousPage: 'priorAuthPage', urlRout: '/CareDelivery/priorAuth' },
    { previousPage: 'pcorPage', urlRout: '/CareDelivery/PatientCareOpportunity' },
    { previousPage: 'selfServicePage', urlRout: '/ServiceInteraction/SelfService' },
    { previousPage: 'callsPage', urlRout: '/ServiceInteraction/Calls' }
  ];
  @select() currentPage;
  constructor(
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private checkStorage: StorageService,
    private session: SessionService,
    private reasonReceived: TopReasonsEmitterService,
    sanitizer: DomSanitizer,
    private nonPaymentService: NonPaymentSharedService,
    private topClaimsSharedService: TopClaimsSharedService,
    private createPayloadService: CreatePayloadService,
    private ngRedux: NgRedux<IAppState>,
    private common: CommonUtilsService
  ) {
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
    const filData = this.session.getFilChangeEmitter().subscribe(() => this.common.urlResuseStrategy());
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.createPayloadService.resetTinNumber('viewTopClaimsPage');
      this.ngRedux.dispatch({ type: REMOVE_FILTER, filterData: { taxId: true } });
      this.common.urlResuseStrategy();
    });
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
    this.topClaimsSharedService.getClaimsData(this.createPayloadService.initialState).then(claimsDetailsData => {
      this.claimsData = [
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },

          ProviderName: 'fff Jorgenson',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },

          ProviderName: 'Colleen Brady',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Theodore Popodopolous',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },

        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'fff Jorgenson',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'fff Jorgenson',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },

          ProviderName: 'Colleen Brady',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Theodore Popodopolous',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },

        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Michael John Monroe',
          NonPaymentAmount: '$325K',
          BilledAmount: '$345K',
          DateOfProcessing: '02/21/2019',
          ClaimNumber: '3453453453'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'fff Jorgenson',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$1.3M',
          BilledAmount: '$2.3M',
          DateOfProcessing: '07/21/2019',
          ClaimNumber: '4564564564'
        },
        {
          TinNameAndNumber: {
            TinName: 'FORSYTH MEMORIAL HOSPITAL',
            TinNumber: '58-1728803'
          },
          ProviderName: 'Srividya Arun',
          NonPaymentAmount: '$650K',
          BilledAmount: '$750K',
          DateOfProcessing: '06/12/2019',
          ClaimNumber: '5675675675'
        }
      ];

      // JSON.parse(JSON.stringify(claimsDetailsData));
      console.log('claimdata', this.claimsData);
      alert(this.claimsData);
      if (this.claimsData) {
        console.log('claimdata', this.claimsData);
        this.numberOfClaims = this.claimsData.length;
        console.log('claims', this.numberOfClaims);
        this.selectedclaims = new MatTableDataSource(this.claimsData);
        this.selectedclaims.paginator = this.paginator;
        this.selectedclaims.sort = this.sort;
        const sortState: Sort = { active: 'TinNameAndNumber', direction: 'asc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
        this.selectedclaims.filterPredicate = (data, filter) => {
          if (data[this.filterObj['key']] && this.filterObj['key']) {
            return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
          }
          return false;
        };
      }
    });
    this.clickSubReason = this.reasonReceived.message.subscribe(
      data => {
        console.log('View Top Claims Non-Payment data', data);
        this.viewsClaimsFullData = data;
        console.log(this.viewsClaimsFullData);

        // if (this.numberOfClaims > 24) {
        //   this.customPaginator();
        // } else {
        //   this.selectedclaims.paginator = null;
        // }
      },
      err => {
        console.log('Error, View Top Claims Non-Payment Data', err);
      }
    );
  }
  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'viewTopClaimsPage' });
  }

  getPageSize(event) {
    this.pageSize = event.pageSize;
  }
  // getViewClaimsData(reasonSelected, subReason) {
  //   this.claimsData = [];
  //   this.topClaimsSharedService.getClaimsData(this.createPayloadService.payload, reasonSelected, subReason)
  //     .then(claimsDetailsData => {
  //       console.log('claims', claimsDetailsData);
  //       this.claimsData = JSON.parse(JSON.stringify(claimsDetailsData));

  //       if (this.claimsData && this.claimsData.length > 0) {
  //         this.numberOfClaims = this.claimsData.length;
  //         console.log('claims', this.numberOfClaims);
  //         this.selectedclaims = new MatTableDataSource(this.claimsData);
  //         this.selectedclaims.sort = this.sort;
  //         const sortState: Sort = { active: 'Tin', direction: 'asc' };
  //         this.sort.active = sortState.active;
  //         this.sort.direction = sortState.direction;
  //         this.sort.sortChange.emit(sortState);
  //         this.selectedclaims.filterPredicate = (data, filter) => {
  //           if (data[this.filterObj['key']] && this.filterObj['key']) {
  //             return data[this.filterObj['key']].toLowerCase().includes(this.filterObj['value']);
  //           }
  //           return false;
  //         };
  //       }

  //     });
  // }
  searchTaxId(filterValue: string, id: string) {
    this.filterObj = {
      value: filterValue.trim().toLowerCase(),
      key: id
    };
    this.selectedclaims.filter = filterValue.trim().toLowerCase();
    if (this.selectedclaims.paginator) {
      this.selectedclaims.paginator.firstPage();
    }
  }
  customPaginator() {
    this.selectedclaims.paginator = this.paginator;
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
  toLowerCase(string) {
    const splitStr = string.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
  goback() {
    this.currentPage.subscribe(currentPage => (this.previousPage = currentPage));
    for (let i = 0; i < this.previousPageurl.length; i++) {
      if (this.previousPage === this.previousPageurl[i].previousPage) {
        this.router.navigate([this.previousPageurl[i].urlRout]);
      }
    }
    // this.router.navigate([this.previousPageurl[0].urlRout]);
  }

  capitalize(s) {
    return s[0].toUpperCase();
  }
}
