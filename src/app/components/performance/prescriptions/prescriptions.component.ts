import { SessionService } from 'src/app/shared/session.service';
import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public perfMockCards;
  public perfMockTable;
  loading: boolean;
  loadingTable: boolean;
  isTable: boolean;
  public prescriptionsItems;
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
    private filtermatch: CommonUtilsService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'prescriptionsPage' });
    this.title = rlpPageConf.Perscription.title;
    this.subTitle = rlpPageConf.Perscription.subTitle;
    this.prescriptionLongCardData();
    this.prescriptionTableData();
  }
  prescriptionLongCardData() {
    this.loading = true;
    this.perfMockCards = [{}];
    this.prescriptionsItems = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Perscription, rlpCardType.longCard)
      .then(response => {
        this.prescriptionsItems = response;
        console.log('Component', rlpPageName.Perscription, rlpCardType.longCard, this.prescriptionsItems);
        this.loading = false;
      })
      .catch(reason => {
        console.log('Error', rlpPageName.Perscription, rlpCardType.longCard, reason);
        this.loading = false;
      });
  }
  prescriptionTableData() {
    this.loadingTable = true;
    this.perfMockTable = [{}];
    this.isTable = false;
    this.tableTinShared
      .getTableShared(rlpPageName.Perscription)
      .then(data => {
        this.tableData.thead = staticTableData.Perscription;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        this.isTable = true;
        console.log('prescriptionData', data);
        console.log('Tble header', this.tableData);
        this.loadingTable = false;
      })
      .catch(reason => {
        console.log('Error Prescription page table data', reason);
        this.loadingTable = false;
      });
  }
}
