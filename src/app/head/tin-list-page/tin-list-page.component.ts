import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../shared/session.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CURRENT_PAGE } from '../../store/filter/actions';
import { NgRedux, select } from '@angular-redux/store';
import { Router, NavigationStart } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-tin-list-page',
  templateUrl: './tin-list-page.component.html',
  styleUrls: ['./tin-list-page.component.scss']
})
export class TinListPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tinsDisplayedColumns: string[] = ['Tin', 'Tinname'];
  providerName: string;
  numberOfTins: any;
  tinsData: any;
  selectedtins: any;
  previousPage: any;
  sortFlag: boolean;

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
    sanitizer: DomSanitizer
  ) {
    this.session.getTins().then(data => {
      this.tinsData = data;
      for (let i = 0; i < this.tinsData.length; i++) {
        if (this.tinsData[i].Tinname === 'TIN Name Not Found' || this.tinsData[i].Tinname === null) {
          this.tinsData[i].Tinname = 'Tax ID Name Not Available';
        }
      }
      this.numberOfTins = this.tinsData.length;
      this.paginator._intl.itemsPerPageLabel = 'Display';
      this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
        d3.select('#testid').text(function() {
          return 'Page ';
        });
        d3.select('#testid2').text(function() {
          return page + 1;
        });

        return ' of ' + Math.floor(length / pageSize + 1);
      };
      this.selectedtins = new MatTableDataSource(this.tinsData);
      this.selectedtins.paginator = this.paginator;
      this.selectedtins.sort = this.sort;
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
  }

  ngOnInit() {
    this.sortFlag = true;
    this.paginator1();
    this.providerName = this.session.getHealthCareOrgName();
    this.tooltip();
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
  sorta() {
    this.sort.active = 'Tin';
    if (this.sortFlag === true) {
      this.sort.direction = 'asc';
      this.sortFlag = false;
    } else {
      this.sort.direction = 'desc';
      this.sortFlag = true;
    }
    this.selectedtins.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.selectedtins.filter = filterValue.trim().toLowerCase();
  }
  capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
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
