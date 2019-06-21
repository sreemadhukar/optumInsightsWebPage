import { Component, OnInit } from '@angular/core';
import { CallsSharedService } from '../../../shared/issue-resolution/calls-shared.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FilterExpandService } from '../../../shared/filter-expand.service';
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
  constructor(
    private callsServiceSrc: CallsSharedService,
    private filterExpandService: FilterExpandService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.pageTitle = 'Calls';
    iconRegistry.addSvgIcon(
      'filter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
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
  openFilter() {
    this.filterExpandService.setURL(this.router.url);
  }
}
