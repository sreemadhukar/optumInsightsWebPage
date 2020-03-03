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
    this.subTitleForPrescriptions = `This measure’s objective is to evaluate rate of prescribing
                                     to the Pharmacy Preferred Tiers 1 and 2 which typically have a
                                     lower cost than higher tier drugs.`;
  }
}
