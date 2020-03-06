import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf } from '../../../modals/rlp-data';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public titleForLabs;
  public subTitleForLabs;
  public labsItems;

  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.labsItems = response[2];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
    this.titleForLabs = rlpPageConf.Labs.title;
    this.subTitleForLabs = rlpPageConf.Labs.subTitle;
  }
}
