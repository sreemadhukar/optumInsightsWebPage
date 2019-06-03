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
  mockCards: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  subscription: any;
  loading: boolean;
  hideAllObjects: boolean;
  title = 'Top Reasons for Prior Authorizations Not Approved';
  timePeriod = 'Last 6 Months';
  constructor(private checkStorage: StorageService, private priorAuthShared: PriorAuthSharedService) {
    this.pagesubTitle = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.pageTitle = 'Prior Authorizations';
    this.loading = true;
    this.hideAllObjects = true;
    this.reasonItems = [{}];
    this.summaryItems = [{}];
    this.mockCards = [{}, {}];

    this.priorAuthShared.getPriorAuthData().then(
      data => {
        this.loading = false;
        this.summaryItems = data[0];
        this.reasonItems = data[1];
      },
      error => {
        this.hideAllObjects = false;
      }
    );
  }
}
