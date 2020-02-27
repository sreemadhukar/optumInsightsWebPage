import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  summaryItems: any;
  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
    this.summaryItems = [
      {
        data: 'Specialist',
        title: 'Preferred Specialist Referral Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      },
      {
        data: 'Lab Network',
        title: 'Preferred Lab Network Use Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      },
      {
        data: 'Prescription',
        title: 'Preferred Tier Prescribing Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      }
    ];
  }
}
