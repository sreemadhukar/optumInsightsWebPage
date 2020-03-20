import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public hcoData;
  public perfMockCards;
  public perfMockTable;
  loading: boolean;
  loadingTable: boolean;
  isTable: boolean;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };

  public subscription: any;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private tableTinShared: RlpSharedService,
    private summarySharedService: SummarySharedService,
    private checkStorage: StorageService,
    private filtermatch: CommonUtilsService,
    private route: Router
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
    this.title = rlpPageConf.Labs.title;
    this.subTitle = rlpPageConf.Labs.subTitle;

    this.getHCO();
    this.tableDataTin();
  }

  tableDataTin() {
    this.loadingTable = true;
    this.perfMockTable = [{}];
    this.isTable = false;
    this.tableTinShared
      .getTableShared(rlpPageName.Labs)
      .then(data => {
        this.isTable = true;
        this.loadingTable = false;
        this.tableData.thead = staticTableData.Labs;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
      })
      .catch(reason => {
        console.log('Error Labs page table data', reason);
      });
  }
  getHCO() {
    this.loading = true;
    this.perfMockCards = [{}];
    this.hcoData = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Labs, rlpCardType.longCard)
      .then(response => {
        if (response) {
          this.hcoData = response;
        } else {
          this.route.navigate(['/OverviewPage']);
        }
        this.loading = false;
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Labs, rlpCardType.longCard, reason);
      });
  }
}