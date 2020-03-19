import { SessionService } from 'src/app/shared/session.service';
import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public referralsItems;
  public perfMockCards;
  loading: boolean;
  loadingTable: boolean;
  isTable: boolean;
  public perfMockTable;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };
  public subscription: any;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private tableTinShared: RlpSharedService,
    private summarySharedService: SummarySharedService,
    private checkStorage: StorageService,
    private filtermatch: CommonUtilsService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });
    this.title = rlpPageConf.Referral.title;
    this.subTitle = rlpPageConf.Referral.subTitle;
    this.referralLongCardData();
    this.referralTableData();
  }
  referralLongCardData() {
    this.loading = true;
    this.perfMockCards = [{}];
    this.referralsItems = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.longCard)
      .then(response => {
        this.referralsItems = response;
        console.log('Component', rlpPageName.Referral, rlpCardType.longCard, this.referralsItems);
        this.loading = false;
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Referral, rlpCardType.longCard, this.referralsItems);
        this.loading = false;
      });
  }
  referralTableData() {
    this.loadingTable = true;
    this.perfMockTable = [{}];
    this.isTable = false;
    this.tableTinShared
      .getTableShared(rlpPageName.Referral)
      .then(data => {
        this.tableData.thead = staticTableData.Referral;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        this.isTable = true;
        console.log('Referral data', data);
        this.loadingTable = false;
      })
      .catch(reason => {
        console.log('Error Referral page table data', reason);
        this.loadingTable = false;
      });
  }
}
