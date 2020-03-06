import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
// import { RlpHeaderComponent } from '../../../rlp-common-utils/rlp-header';
import { rlpPageConf } from '../../../modals/rlp-data';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  public titleForSummary;
  public subTitleForSummary;
  public summaryItems: any;
  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.summaryItems = response[0];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
    this.titleForSummary = rlpPageConf.Summary.title;
    this.subTitleForSummary = rlpPageConf.Summary.subTitle;
  }
}
