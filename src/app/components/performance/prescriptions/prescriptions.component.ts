import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { rlpPageConf } from '../../../modals/rlp-data';
@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public titleForPrescriptions;
  public subTitleForPrescriptions;
  public prescriptionsItems;

  constructor(private ngRedux: NgRedux<IAppState>, private perfShared: PerformanceService) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.prescriptionsItems = response[3];
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'prescriptionsPage' });

    this.titleForPrescriptions = rlpPageConf.Perscription.title;
    this.subTitleForPrescriptions = rlpPageConf.Perscription.subTitle;
  }
}
