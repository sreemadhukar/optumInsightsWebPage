import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName } from '../../../modals/rlp-data';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';

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
    private tableTinShared: RlpSharedService
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
