import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf, staticTableData, ItableData } from '../../../modals/rlp-data';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public referralsItems;
  public tableData: ItableData;

  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.referralsItems = response[1];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });
    this.title = rlpPageConf.Referral.title;
    this.subTitle = rlpPageConf.Referral.subTitle;
    this.tableData.thead = staticTableData.Referral;
  }
}
