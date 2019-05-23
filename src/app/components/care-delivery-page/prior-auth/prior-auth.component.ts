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

  constructor(private checkStorage: StorageService, private priorAuthShared: PriorAuthSharedService) {
    this.pagesubTitle = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.pageTitle = 'Prior Authorizations';

    this.reasonItems = [{}];
    this.summaryItems = [{}];

    this.priorAuthShared.getPriorAuthData().then(data => {
      this.summaryItems = data;
    });

    this.priorAuthShared.getPriorAuthNotApprovedReasons().then(data => {
      this.reasonItems = data;
    });
  }
}
