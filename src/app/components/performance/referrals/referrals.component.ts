import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public titleForReferrals;
  public subTitleForReferrals;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'referralsPage' });

    this.titleForReferrals = 'Preferred Specialist Referral Rate';
    this.subTitleForReferrals = `This measure’s objective is to evaluate referrals by primary care
                                 physicians (PCPs) to preferred specialists who have demonstrated
                                 a high-quality and lower total cost of care performance.`;
  }
}
