import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public referralsItems;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private tableTinShared: RlpSharedService,
    private summarySharedService: SummarySharedService
  ) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.referralsItems = response[1];
      console.log('Long Card', this.referralsItems);
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });
    this.title = rlpPageConf.Referral.title;
    this.subTitle = rlpPageConf.Referral.subTitle;
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.longCard)
      .then(response => {
        console.log(rlpPageName.Referral, rlpCardType.longCard, response);
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Referral, rlpCardType.longCard, reason);
      });

    this.tableTinShared
      .getTableShared(rlpPageName.Referral)
      .then(data => {
        this.tableData.thead = staticTableData.Referral;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        console.log('Referral data', data);
      })
      .catch(reason => {
        console.log('Error Referral page table data', reason);
      });
  }
}
