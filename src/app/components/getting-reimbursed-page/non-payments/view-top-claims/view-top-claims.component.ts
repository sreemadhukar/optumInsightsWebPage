import { filter } from 'rxjs/operators';
import { CommonUtilsService } from './../../../../shared/common-utils.service';
import { StorageService } from './../../../../shared/storage-service.service';
import { NonPaymentSharedService } from './../../../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { CreatePayloadService } from './../../../../shared/uhci-filters/create-payload.service';

import { SessionService } from './../../../../shared/session.service';
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';

import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE, REMOVE_FILTER } from './../../../../store/filter/actions';
import { NgRedux, select } from '@angular-redux/store';
import { Router, NavigationStart } from '@angular/router';
import { IAppState } from './../../../../store/store';
import * as d3 from 'd3';
import { TopClaimsSharedService } from './../../../../shared/getting-reimbursed/non-payments/top-claims-shared.service';
import { TopReasonsEmitterService } from './../../../../shared/getting-reimbursed/non-payments/top-reasons-emitter.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-view-top-claims',
  templateUrl: './view-top-claims.component.html',
  styleUrls: ['./view-top-claims.component.scss']
})
export class ViewTopClaimsComponent implements OnInit, AfterViewInit {
  dollarData: boolean;
  hideAllObjects: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedclaims: any;
  numberOfClaims: any;
  tinsDisplayedColumns: string[] = [
    'TinNumber',
    'ProviderName',
    'NonPaymentAmount',
    'BilledAmount',
    'DateOfProcessing',
    'ClaimNumber'
  ];

  pageSize = 25;
  filterObj = {};
  subscription: any;
  ProviderSysKey: any;
  viewClaimsValue: any;
  providerName: string;
  isLoading = true;
  lengthOffilteredData: any;
  dataNotavaiable: Boolean = false;
  viewsClaimsFullData: any;
  tinsData: any;
  public topreasons: string;
  public fullData: any;
  public subReasonData: Array<Object> = [{}];
  previousPage: any;
  viewClaimsByFilter: string;
  public clickSubReason: Subscription;
  tableViewData: any;
  claimsData: Array<Object> = [{}];
  showTableBool: Boolean = true;
  viewClaimsFilterDOP: boolean;
  viewClaimsFilterDOS: boolean;
  loading: boolean;
  public finaldata: any[] = [];
  public temp;
  public subreasonvalues = [];
  students: Array<Object> = [];
  programs: Array<Object>;
  selectedReasonItem: any;
  public categoryGroups;
  public subReasonselected: any;
  public subReason: any;
  public selectedSubreasonArray: any;
  public selectedSubreason: any;
  tableData: any;

  tinNumberFilter = new FormControl('');
  provideNameFilter = new FormControl('');
  claimNumberFilter = new FormControl('');
  filterValues = {
    TinNumber: '',
    ProviderName: '',
    NonPaymentAmount: '',
    BilledAmount: '',
    DateOfProcessing: '',
    ClaimNumber: ''
  };
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
  }

  ngOnInit() {
    this.dataNotavaiable = false;
    this.temp = this.reasonReceived.sendData;
    this.fullData = this.temp.fullData;
    // claims reason and sub reason Dropwdown
    console.log('full data', this.fullData);
    // claims reason and sub reason Dropwdown
    this.selectedReasonItem = this.temp.reasonSelected;
    this.selectedSubreason = this.temp.subReason;

    this.selectedSubreasonArray = this.fullData
      .filter(item => item.mainReason === this.selectedReasonItem)
      .map(item => item.subReason)[0];
    this.subReason = this.selectedSubreasonArray;
    if (this.temp.reasonSelected === this.temp.subReason) {
      this.temp.subReason = 'UNKNOWN';
    }

    this.isLoading = true;
    this.dollarData = false;

    // pagination
    this.paginator._intl.itemsPerPageLabel = 'Display';

    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'viewTopClaimsPage' });
    // VieCaliamFilter
    this.viewClaimsByFilter = this.createPayloadService.initialState['viewClaimsByFilter'];

    if (this.viewClaimsByFilter === 'DOS') {
      this.viewClaimsValue = 'Date of Service';
    } else if (this.viewClaimsByFilter === 'DOP') {
      this.viewClaimsValue = 'Date of Processing';
    }
    this.selectedclaims = new MatTableDataSource(this.claimsData);
    // pagination
    this.selectedclaims.paginator = this.paginator;
    // sorting
    this.selectedclaims.sort = this.sort;

    // load table data
    if (this.claimsData !== null) {
      this.dataNotavaiable = true;
      this.loadTable(this.temp.reasonSelected, this.temp.subReason);
    } else {
      this.dataNotavaiable = false;
    }
  }

  ngAfterViewInit() {
    if (this.claimsData !== null) {
      // sorting
      this.selectedclaims.sort = this.sort;

      this.customPaginator();

      // pagination
      this.selectedclaims.paginator = this.paginator;
    }
    this.tinNumberFilter.valueChanges.subscribe(tinNumberValue => {
      this.filterValues['TinNumber'] = tinNumberValue;
      this.selectedclaims.filter = JSON.stringify(this.filterValues);
    });
    this.provideNameFilter.valueChanges.subscribe(providerNameValue => {
      this.filterValues['ProviderName'] = providerNameValue;
      this.selectedclaims.filter = JSON.stringify(this.filterValues);
    });
    this.claimNumberFilter.valueChanges.subscribe(claimNumbeValue => {
      this.filterValues['ClaimNumber'] = claimNumbeValue;
      this.selectedclaims.filter = JSON.stringify(this.filterValues);
    });

    this.selectedclaims.filterPredicate = this.customFilterPredicate();
  }
  // Reason selection from dropdown
  selectTopReason(value) {
    this.selectedSubreasonArray = this.fullData
      .filter(item => item.mainReason === value)
      .map(item => item.subReason)[0];
    this.subReason = this.selectedSubreasonArray;
    this.selectedReasonItem = value;
    this.selectedSubreason = this.selectedSubreasonArray[0];

    if (this.selectedReasonItem === this.selectedSubreason) {
      this.selectedSubreason = 'UNKNOWN';
    }
    this.loadTable(this.selectedReasonItem, this.selectedSubreason);
  }
  // sub reasons selection from dropdown
  selectsubReason(filterVal) {
    if (filterVal) {
      this.dataNotavaiable = true;
      this.isLoading = false;
      this.subReasonselected = filterVal;
      if (this.selectedReasonItem === this.subReasonselected) {
        this.subReasonselected = 'UNKNOWN';
      }
      this.loadTable(this.selectedReasonItem, this.subReasonselected);
    }
  }
  goback() {
    this.currentPage.subscribe(currentPage => (this.previousPage = currentPage));
    for (let i = 0; i < this.previousPageurl.length; i++) {
      if (this.previousPage === this.previousPageurl[i].previousPage) {
        this.router.navigate([this.previousPageurl[i].urlRout]);
      }
    }
    this.router.navigate([this.previousPageurl[3].urlRout]);
  }

  // load table data
  loadTable(reasonSelected, subReason) {
    this.isLoading = false;
    this.topClaimsSharedService
      .getClaimsData(this.createPayloadService.initialState, reasonSelected, subReason)
      .then(claimsDetailsData => {
        this.isLoading = true;
        this.selectedclaims = [];
        this.claimsData = JSON.parse(JSON.stringify(claimsDetailsData));

        if (this.claimsData && this.claimsData.length > 0) {
          this.numberOfClaims = this.claimsData.length;
          this.selectedclaims = new MatTableDataSource(this.claimsData);
          // console.log('mat table', this.selectedclaims);
          this.dollarData = true;
          this.dataNotavaiable = false;
          this.selectedclaims.sort = this.sort;
          this.selectedclaims.paginator = this.paginator;

          this.isLoading = false;
          this.selectedclaims.filterPredicate = this.customFilterPredicate();
          this.lengthOffilteredData = this.selectedclaims.filteredData.length;
        } else {
          this.tableData = {
            category: 'large-card',
            type: 'donutWithoutLabelBottom',
            status: 404,
            data: null
          };
          this.dollarData = false;
          this.isLoading = true;
        }
      })
      .catch(error => {
        console.log('Dat is not available', error);
      });
  }
  customFilterPredicate(): (data: any, filter: string) => boolean {
    const filterFunction = function(data: any, filterValuedata: string): boolean {
      const searchTerms = JSON.parse(filterValuedata);

      return (
        data.TinNumber.trim()
          .toLowerCase()
          .indexOf(searchTerms.TinNumber) !== -1 &&
        data.ProviderName.trim()
          .toLowerCase()
          .indexOf(searchTerms.ProviderName.toLowerCase()) !== -1 &&
        data.ClaimNumber.toString()
          .trim()
          .toLowerCase()
          .indexOf(searchTerms.ClaimNumber.toLowerCase()) !== -1
      );
    };
    return filterFunction;
  }
  getPageSize(event) {
    this.pageSize = event.pageSize;
    console.log('page size', this.pageSize);
  }

  customPaginator() {
    this.selectedclaims.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Display';
    this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
      d3.select('#page-text').text(function() {
        return 'Page ';
      });
      d3.select('#page-number')
        .text(function() {
          return page + 1;
        })
        .attr('font-size', '16')
        .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
        .attr('fill', '#2D2D39');

      if (length % pageSize === 0) {
        return ' of ' + Math.floor(length / pageSize);
      } else {
        return ' of ' + Math.floor(length / pageSize + 1);
      }
    };

    d3.select('.mat-paginator-container')
      .insert('div')
      .text('per page')
      .attr('font-size', '14')
      .attr('font-family', "'UHCSans-Medium','Helvetica', 'Arial', 'sans-serif'")
      .attr('color', '#757588')
      .style('flex-grow', '5')
      .lower();

    d3.select('.mat-paginator-range-label')
      .insert('div')
      .style('border', '1px solid #B3BABC')
      .style('border-radius', '2px')
      .style('font-size', '16')
      .style('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .style('color', '#2D2D39')
      .style('float', 'left')
      .style('margin', '-13px 5px 0px 5px')
      .style('padding', '10px 20px 10px 20px')
      .attr('id', 'page-number')
      .lower();

    d3.select('.mat-paginator-range-label')
      .insert('span')
      .attr('font-size', '16')
      .attr('font-family', "'UHCSans-SemiBold','Helvetica', 'Arial', 'sans-serif'")
      .attr('color', '#2D2D39')
      .style('float', 'left')
      .lower()
      .attr('id', 'page-text');
  }

  capitalize(s) {
    return s[0].toUpperCase();
  }

  // Convert String to number with two decimals
  convertIntoNumber(str) {
    const strvalue = str;
    // const res = strvalue.replace(/[$,]/g, '');
    // const val = parseFloat(res).toFixed(2);

    // parseFloat(res).toFixed(2).replace(/\.?0*$/,'');;
    const val = parseFloat(strvalue).toFixed(2);
    return val;
  }
}
