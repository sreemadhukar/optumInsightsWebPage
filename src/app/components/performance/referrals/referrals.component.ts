import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public titleForReferrals;
  public subTitleForReferrals;
  public referralsItems;

  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.referralsItems = response[1];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });

    this.titleForReferrals = 'Preferred Specialist Referral Rate';
    this.subTitleForReferrals = `Here is where our optional page title description text would live if we needed to use it.
    You can easily remove this from the design by hiding it in your symbol overrides. Please DO NOT detach this symbol.`;
  }
}
