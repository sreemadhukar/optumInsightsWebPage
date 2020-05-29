import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-no-access-error-page',
  templateUrl: './no-access-error-page.component.html',
  styleUrls: ['./no-access-error-page.component.scss']
})
export class NoAccessErrorPageComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isInternal = false;
  linkLoginPage = environment.apiUrls.linkLoginPage;

  constructor() {}

  ngOnInit() {}
}
