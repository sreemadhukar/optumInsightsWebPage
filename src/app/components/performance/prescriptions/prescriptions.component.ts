import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public loading;
  // public loadingTable;
  public perfMockCards;
  public prescriptionsItems;
  public isTable: boolean;
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
    this.isTable = false;
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'prescriptionsPage' });
    this.title = rlpPageConf.Perscription.title;
    this.subTitle = rlpPageConf.Perscription.subTitle;

    this.getHCO();
    this.tableDataTin();
  }
  tableDataTin() {
    this.tableTinShared
      .getTableShared(rlpPageName.Perscription)
      .then(data => {
        this.isTable = true;
        this.tableData.thead = staticTableData.Perscription;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        // this.loadingTable = false;
      })
      .catch(reason => {
        console.log('Error Prescription page table data', reason);
        // this.loadingTable = false;
      });
  }
  getHCO() {
    this.loading = true;
    this.perfMockCards = [{}];
    this.prescriptionsItems = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Perscription, rlpCardType.longCard)
      .then(response => {
        this.loading = false;
        if (response) {
          this.prescriptionsItems = response;
        } else {
          this.route.navigate(['/']);
        }
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Perscription, rlpCardType.longCard, reason);
        this.loading = false;
      });
  }
}
