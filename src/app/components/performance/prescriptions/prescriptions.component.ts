import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf, staticTableData, ItableType, rlpPageName } from '../../../modals/rlp-data';
import { RlpSharedService } from '../../../shared/performance/rlp-shared.service';
@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public title: string;
  public subTitle: string;
  public prescriptionsItems;
  public tableData: ItableType = {
    thead: [],
    tbody: []
  };

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private tableTinShared: RlpSharedService
  ) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.prescriptionsItems = response[3];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'prescriptionsPage' });
    this.title = rlpPageConf.Perscription.title;
    this.subTitle = rlpPageConf.Perscription.subTitle;

    this.tableTinShared
      .getTableShared(rlpPageName.Perscription)
      .then(data => {
        this.tableData.thead = staticTableData.Perscription;
        this.tableData.tbody = JSON.parse(JSON.stringify(data));
        console.log('prescriptionData', data);
        console.log('Tble header', this.tableData);
      })
      .catch(reason => {
        console.log('Error Prescription page table data', reason);
      });
  }
}
