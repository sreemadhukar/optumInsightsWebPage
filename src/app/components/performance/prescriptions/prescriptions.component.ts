import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public titleForPrescriptions;
  public subTitleForPrescriptions;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'prescriptionsPage' });

    this.titleForPrescriptions = 'Preferred Tier Prescribing Rate';
    this.subTitleForPrescriptions = `Here is where our optional page title description text would
                                 live if we needed to use it. You can easily remove this
                                 from the design by hiding it in your symbol overrides.
                                 Please DO NOT detach this symbol.`;
  }
}
