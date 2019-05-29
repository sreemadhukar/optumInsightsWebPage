import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';

@Component({
  selector: 'app-prior-auth',
  templateUrl: './prior-auth.component.html',
  styleUrls: ['./prior-auth.component.scss']
})
export class PriorAuthComponent implements OnInit {
  summaryItems: any;
  reasonItems: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  subscription: any;
  title = 'Top Reasons for Prior Authorizations Not Approved';
  timePeriod = 'Last 6 Months';
  constructor(
    private priorAuthService: PriorAuthService,
    private sessionService: SessionService,
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService
  ) {
    this.pagesubTitle = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  ngOnInit() {
    const parameters = [this.sessionService.providerkey.toString(), true];
    this.pageTitle = 'Prior Authorizations';

    this.reasonItems = [{}];
    this.summaryItems = [{}];

    /*
    this.priorAuthShared.getPriorAuthData().then(data => {
      this.summaryItems = data;
    });
    */

    this.priorAuthShared.getPriorAuthNotApprovedReasons().then(data => {
      this.reasonItems = data;
    });

    this.priorAuthShared.getPriorAuthCounts().then(data => {
      this.summaryItems = data;
    });
  }
}
