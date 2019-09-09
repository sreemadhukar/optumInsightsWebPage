import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';
import { SessionService } from '../../../shared/session.service';
@Component({
  selector: 'app-overview-advocate',
  templateUrl: './overview-advocate.component.html',
  styleUrls: ['./overview-advocate.component.scss']
})
export class OverviewAdvocateComponent implements OnInit {
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(private checkStorage: StorageService, private session: SessionService) {
    this.pageTitle = 'Welcome, ' + this.userName;
    this.pagesubTitle = 'Your Insights at a glance.';
  }

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Welcome, ' + this.userName;
  }
}
