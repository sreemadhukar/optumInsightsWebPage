import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit, OnDestroy {
  public title: string;
  public subTitle: string;
  public hcoData;
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
    private readonly summarySharedService: SummarySharedService,
    private readonly checkStorage: StorageService,
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
  ngOnDestroy() {
    this.tableTinShared.unGetTable();
  }
  tableDataTin() {
    this.loadingTable = true;
    this.isTable = false;
    this.tableTinShared
      .getTableShared(rlpPageName.Labs)
      .then(data => {
        this.loadingTable = false;
        if (data) {
          this.isTable = true;
          this.tableData.thead = staticTableData.Labs;
          this.tableData.tbody = data;
        } else {
          this.isTable = false;
        }
      })
      .catch(reason => {
        this.loadingTable = false;
        this.isTable = false;
        console.log('Error Labs page table data', reason);
      });
  }
  getHCO() {
    this.loading = true;
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
