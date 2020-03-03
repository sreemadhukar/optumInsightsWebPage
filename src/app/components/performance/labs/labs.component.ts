import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public titleForLabs;
  public subTitleForLabs;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
    this.titleForLabs = 'Preferred Lab Network Use Rate';
    this.subTitleForLabs = `This measure’s objective is to evaluate use of the Preferred Lab Network
                            which is comprised of independent labs that have demonstrated high
                            standards for quality, service and affordability.`;
  }
}
