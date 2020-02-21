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
  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    // this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
  }
}
