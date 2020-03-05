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
    this.subTitleForReferrals = `This measure’s objective is to evaluate referrals by primary care
                                 physicians (PCPs) to preferred specialists who have demonstrated
                                 a high-quality and lower total cost of care performance.`;
  }
}
