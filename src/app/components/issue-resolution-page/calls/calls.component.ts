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
  timePeriod = 'Last 3 months';

  constructor(private callsServiceSrc: CallsSharedService) {
    this.pageTitle = 'Calls';
  }

  ngOnInit() {
    this.callsServiceSrc
      .getCallsData()
      .then(data => {
        this.callsItems = data[0];
        console.log(this.callsItems);
      })
      .catch(reason => console.log('Calls Service Error ', reason));
  }
}
