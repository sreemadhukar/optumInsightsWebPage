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
  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'labsPage' });
  }
}
