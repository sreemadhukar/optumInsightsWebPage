import { Component, OnInit, AfterContentInit } from '@angular/core';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterContentInit {
  overviewItems: any;
  mainCards: any;
  selfServiceMiniCards: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  opportunities: String = '';
  opportunitiesQuestion: String = '';
  welcomeMessage: String = '';
  subscription: any;
  loading = false;

  constructor(
    private overviewsrc: OverviewSharedService,
    private checkStorage: StorageService,
    private session: SessionService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.pagesubTitle = 'Your Insights at a glance.';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';
    this.welcomeMessage = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_right-24px.svg')
    );
  }
  ngOnInit() {
    this.loading = true;
    this.overviewsrc
      .getOverviewData()
      .then(data => {
        this.loading = false;
        this.overviewItems = [];
        this.mainCards = [];
        this.selfServiceMiniCards = [];
        this.overviewItems = JSON.parse(JSON.stringify(data));
        console.log(this.overviewItems);
        this.mainCards = this.overviewItems[0];
        this.selfServiceMiniCards = this.overviewItems[1];
        console.log(this.selfServiceMiniCards);
      })
      .catch(reason => {
        this.loading = true;
        console.log(reason);
      });
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.userName =
      this.session.sessionStorage('loggedUser', 'LastName') +
      ' ' +
      this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
  }

  ngAfterContentInit() {}
}
