import { NonPaymentSharedService } from './../../../../shared/getting-reimbursed/non-payments/non-payment-shared.service';
import { CreatePayloadService } from './../../../../shared/uhci-filters/create-payload.service';

import { SessionService } from './../../../../shared/session.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CURRENT_PAGE } from './../../../../store/filter/actions';
import { NgRedux, select } from '@angular-redux/store';
import { Router, NavigationStart } from '@angular/router';

import * as d3 from 'd3';
import { TopClaimsSharedService } from './../../../../shared/getting-reimbursed/non-payments/top-claims-shared.service';
import { TopReasonsEmitterService } from './../../../../shared/getting-reimbursed/non-payments/top-reasons-emitter.service';

@Component({
  selector: 'app-view-top-claims',
  templateUrl: './view-top-claims.component.html',
  styleUrls: ['./view-top-claims.component.scss']
})
export class ViewTopClaimsComponent implements OnInit {
  ProviderSysKey: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tinsDisplayedColumns: string[] = [
    'Tin',
    'ProviderName',
    'NonPaymentAmount',
    'BilledAmount',
    'DateOfProcessing',
    'ClaimNumber'
  ];
  providerName: string;
  numberOfClaims: any;
  numberofClaimsShowing: any;
  tinsData: any;
  selectedclaims: any;
  previousPage: any;
  sortFlag: boolean;
  sortFlagTin: boolean;
  clickSubReason: Subscription;
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
    private session: SessionService,
    private reasonReceived: TopReasonsEmitterService,
    sanitizer: DomSanitizer,
    private nonPaymentService: NonPaymentSharedService,
    private topClaimsSharedService: TopClaimsSharedService,
    private createPayloadService: CreatePayloadService
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
  }
  ngOnInit() {
    this.clickSubReason = this.reasonReceived.message.subscribe(
      data => {
        console.log('data', data);
        console.log('Full Data', data.fullData);
        console.log('Main Reason', data.reasonSelected);
        console.log('Main Reason', data.subReason);
        //        console.log('SubReason', data.reasonSelected);
        this.getClaimsData(data.reasonSelected, data.subReason);
      },
      err => {
        console.log('Error, View Top Claims Non-Payment Data', err);
      }
    );
    // this.sortFlagTin = true;
    // this.paginator1();
    // this.providerName = this.session.getHealthCareOrgName();
    // this.tooltip();
    // this.sort.active = 'Tin';
    // this.sort.direction = 'asc';
    // this.sortFlag = false;
    // this.selectedclaims.sort = this.sort;
    this.claimsData = [];
    this.createPayloadService.getEvent().subscribe(value => {
      this.ngOnInit();
    });
    // this.numberOfClaims = this.claimsData.length;
    // this.numberofClaimsShowing = this.claimsData.length;
    // this.paginator._intl.itemsPerPageLabel = 'Display';
    // this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
    //   d3.select('#testid').text(function() {
    //     return 'Page ';
    //   });
    //   d3.select('#testid2').text(function() {
    //     return page + 1;
    //   });

    //   return ' of ' + Math.floor(length / pageSize + 1);
    // };
    // this.selectedclaims = new MatTableDataSource(this.claimsData);
    // this.selectedclaims.paginator = this.paginator;
    // this.selectedclaims.sort = this.sort;
  }

  getClaimsData(reasonSelected, subReason) {
    this.topClaimsSharedService
      .getClaimsData(reasonSelected, subReason, this.createPayloadService.payload)
      .then(claimsDetailsData => {
        this.claimsData = JSON.parse(JSON.stringify(claimsDetailsData));
        console.log('ffsdfdfd', this.claimsData);
      });
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
  sorta(value: string) {
    if (this.sort.active !== value) {
      this.sortFlag = true;
    }
    if (value === 'Tin') {
      this.sortFlagTin = true;
    } else {
      this.sortFlagTin = false;
    }
    this.sort.active = value;
    if (this.sortFlag === true) {
      this.sort.direction = 'asc';
      this.sortFlag = false;
    } else {
      this.sort.direction = 'desc';
      this.sortFlag = true;
    }
    this.selectedclaims.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.selectedclaims.filter = filterValue.trim().toLowerCase();
    this.numberofClaimsShowing = this.selectedclaims.filteredData.length;
  }
  capitalize(s) {
    return s[0].toUpperCase();
  }
  paginator1() {
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
      .attr('id', 'testid2')
      .lower();

    d3.select('.mat-paginator-range-label')
      .insert('span')
      .style('float', 'left')
      .lower()
      .attr('id', 'testid');
  }
  tooltip() {
    d3.select('#tooltip-info')
      .style('position', 'absolute')
      .style('width', '230px')
      .style('height', '100px')
      .style('background-color', 'white')
      .style('border-radius', '2px')
      .style('display', 'none');

    d3.select('#tooltip-info-div').on('mouseenter', function(d) {
      d3.select('#tooltip-info-div').on('mouseover', function(e) {
        d3.select('#tooltip-info')
          .style('display', 'inline')
          .style('left', d3.event.layerX + 13 + 'px')
          .style('top', d3.event.layerY - 35 + 'px');
      });
    });
    d3.select('#tooltip-info-div').on('mouseleave', function(d) {
      d3.select('#tooltip-info')
        .style('display', 'none')
        .style('left', d3.event.layerX + 13 + 'px')
        .style('top', d3.event.layerY - 35 + 'px');
    });
  }
}
