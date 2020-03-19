import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public referralsItems;
  // public loadingTable;
  public perfMockCards;
  loading: boolean;
  loadingTable: boolean;
  public isTable: boolean;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };
  public subscription: any;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private tableTinShared: RlpSharedService,
    private summarySharedService: SummarySharedService,
    private checkStorage: StorageService,
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
  tableDataTin() {
    this.tableTinShared
      .getTableShared(rlpPageName.Referral)
      .then(data => {
        this.isTable = true;
        this.tableData.thead = staticTableData.Referral;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        console.log('Referral data', data);
        this.loadingTable = false;
      })
      .catch(reason => {
        console.log('Error Referral page table data', reason);
        this.loadingTable = false;
      });
  }
  getHCO() {
    this.loading = true;
    this.perfMockCards = [{}];
    this.referralsItems = [];
    this.loadingTable = true;
    this.isTable = false;
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.longCard)
      .then(response => {
        if (response) {
          this.referralsItems = response;
          this.loading = false;
        } else {
          this.route.navigate(['/']);
        }
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Referral, rlpCardType.longCard, reason);
        this.loading = false;
      });
  }
}
