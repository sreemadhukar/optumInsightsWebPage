import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf, staticTableData, ItableData } from '../../../modals/rlp-data';

export interface ItableData {
  thead: Array<string>;
  tbody: any;
}
@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public labsItems;
  public tableData: ItableData;
  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.labsItems = response[2];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
    this.title = rlpPageConf.Labs.title;
    this.subTitle = rlpPageConf.Labs.subTitle;
    this.tableData.thead = staticTableData.Labs;
  }
}
