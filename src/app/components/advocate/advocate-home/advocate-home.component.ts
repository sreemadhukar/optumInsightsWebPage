import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/session.service';

@Component({
  selector: 'app-advocate-home',
  templateUrl: './advocate-home.component.html',
  styleUrls: ['./advocate-home.component.scss']
})
export class AdvocateHomeComponent implements OnInit {
  pageTitle: String;
  pagesubTitle: String;
  userName;
  constructor(private session: SessionService) {}

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = `Hi, ${this.userName}.`;
    this.pagesubTitle = 'Welcome to UHC Insights';
  }
}
