import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/session.service';

@Component({
  selector: 'app-aco-page',
  templateUrl: './aco-page.component.html',
  styleUrls: ['./aco-page.component.scss']
})
export class AcoPageComponent implements OnInit {
  loading = true;
  public pageTitle: any;
  constructor(private session: SessionService) {
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
  }

  ngOnInit() {}
}
