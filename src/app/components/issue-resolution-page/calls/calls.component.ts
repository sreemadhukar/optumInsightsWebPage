import { Component, OnInit } from '@angular/core';
import { CallsSharedService } from '../../../shared/issue-resolution/calls-shared.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callsItems: Array<Object> = [{}];
  pageTitle: String = '';
  timePeriod = 'Last 6 months';
  loading: boolean;
  mockCards: any;
  constructor(private callsServiceSrc: CallsSharedService) {
    this.pageTitle = 'Calls';
  }

  ngOnInit() {
    this.loading = true;
    this.mockCards = [{}, {}];
    this.callsServiceSrc
      .getCallsData()
      .then(data => {
        this.loading = false;
        this.callsItems = data[0];
      })
      .catch(reason => {
        console.log('Calls Service Error ', reason);
        this.loading = false;
      });
  }
}
