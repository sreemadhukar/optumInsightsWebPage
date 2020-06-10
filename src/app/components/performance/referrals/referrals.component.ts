import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit, OnDestroy {
  public title: string;
  public subTitle: string;
  public hcoData;
  public loading: boolean;
  public loadingTable: boolean;
  public isTable: boolean;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };
  public subscription: any;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private tableTinShared: RlpSharedService,
    private readonly summarySharedService: SummarySharedService,
    private readonly checkStorage: StorageService,
    private filtermatch: CommonUtilsService,
    private route: Router
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });
    this.title = rlpPageConf.Referral.title;
    this.subTitle = rlpPageConf.Referral.subTitle;
    this.getHCO();
    this.tableDataTin();
  }
  ngOnDestroy() {
    this.tableTinShared.unGetTable();
  }
  tableDataTin() {
    this.loadingTable = true;
    this.isTable = false;
    this.tableTinShared
      .getTableShared(rlpPageName.Referral)
      .then(data => {
        this.loadingTable = false;
        this.isTable = true;
        this.tableData.thead = staticTableData.Referral;
        this.tableData.tbody = data;
      })
      .catch(reason => {
        console.log('Error Referral page table data', reason);
      });
  }
  getHCO() {
    this.loading = true;
    this.hcoData = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.longCard)
      .then(response => {
        this.loading = false;
        if (response) {
          this.hcoData = response;
        } else {
          this.route.navigate(['/OverviewPage']);
        }
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Referral, rlpCardType.longCard, reason);
      });
  }
}
