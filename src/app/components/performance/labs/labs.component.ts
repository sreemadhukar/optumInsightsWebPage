import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public labsItems;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private tableTinShared: RlpSharedService,
    private summarySharedService: SummarySharedService
  ) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.labsItems = response[2];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
    this.title = rlpPageConf.Labs.title;
    this.subTitle = rlpPageConf.Labs.subTitle;
    this.summarySharedService
      .getHCOdata(rlpPageName.Labs, rlpCardType.longCard)
      .then(response => {
        console.log(rlpPageName.Labs, rlpCardType.longCard, response);
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Labs, rlpCardType.longCard, reason);
      });

    this.tableTinShared
      .getTableShared(rlpPageName.Labs)
      .then(data => {
        this.tableData.thead = staticTableData.Labs;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        console.log('Labs', data);
      })
      .catch(reason => {
        console.log('Error Labs page table data', reason);
      });
  }
}
