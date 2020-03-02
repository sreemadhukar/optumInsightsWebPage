import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
// import { RlpHeaderComponent } from '../../../rlp-common-utils/rlp-header';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  public titleForSummary;
  public subTitleForSummary;
  data: any;
  summaryItems: any;
  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {}

  ngOnInit() {
    this.data = this.perfShared.getPerformanceData();
    console.log(this.data);
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
    this.titleForSummary = 'Performance Management Summary';
    this.subTitleForSummary = `Improve your performance through rendering, ordering, prescribing and
                               referring actions that achieve lower total cost of care.`;
    this.summaryItems = [
      {
        data: 'Specialist',
        type: 'rpl-small-bar',
        title: 'Preferred Specialist Referral Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      },
      {
        data: 'Lab Network',
        type: 'rpl-small-bar',
        title: 'Preferred Lab Network Use Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      },
      {
        data: 'Prescription',
        type: 'rpl-small-bar',
        title: 'Preferred Tier Prescribing Rate',
        timeperiod: 'Year to Date (Jan 1, 2020-Mar 31, 2020)'
      }
    ];
  }
}
