import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  public titleForReferrals;
  public subTitleForReferrals;

  constructor() {}

  ngOnInit() {
    this.titleForReferrals = 'Preferred Specialist Referral Rate';
    this.subTitleForReferrals = `Here is where our optional page title description text would
                                 live if we needed to use it. You can easily remove this
                                 from the design by hiding it in your symbol overrides.
                                 Please DO NOT detach this symbol.`;
  }
}
