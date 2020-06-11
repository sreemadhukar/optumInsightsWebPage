import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { FilterExpandService } from 'src/app/shared/filter-expand.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { findIndex as _findIndex } from 'lodash';
// import { UserReviewService } from 'src/app/shared/user-review.service';
// declare const externalRatingIntercept: any;

export interface FilterOptions {
  title: string;
  default: boolean;
  selected: boolean;
  quarterFormat: string;
  timeFrameFormat: string;
  filters: string[];
  priorAuthFilters: string[];
}

@Component({
  selector: 'app-kop-onboarding',
  templateUrl: './kop-onboarding.component.html',
  styleUrls: ['./kop-onboarding.component.scss']
})
export class KopOnboardingComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  public currentFilter: any = {};
  public isError = false;
  public navLinks = [
    {
      label: 'Summary',
      path: 'Summary',
      subLabel: 'Key Onboarding Metrices',
      isActive: true
    },
    {
      label: 'Credentailing',
      path: 'Summary/credentailing',
      subLabel: ' ',
      isActive: false
    },
    {
      label: 'Contracting',
      path: 'Summary/contracting',
      subLabel: ' ',
      isActive: false
    },
    {
      label: 'Verbatims',
      path: 'Summary/verbatims',
      subLabel: 'Provider Comments',
      isActive: false
    }
  ];

  // private userreviewservice: UserReviewService // add these to constructor if needed
  constructor(
    private eventEmitter: EventEmitterService,
    private filterExpandService: FilterExpandService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.iconRegistry.addSvgIcon(
      'filter',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-filter_list-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'error',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );
  }

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
  }

  ngOnDestroy(): void {
    this.eventEmitter.emitEvent(false);
  }

  openFilter() {
    this.filterExpandService.setData({ url: this.router.url, customFilter: true });
  }

  setActiveIndex(i) {
    const lastActiveIndex = _findIndex(this.navLinks, { isActive: true });
    this.navLinks[lastActiveIndex]['isActive'] = false;
    this.navLinks[i]['isActive'] = true;
  }

  getNPSData() {}

  // changeOfRoutes() {
  //   this.userreviewservice.removeCreatedCookies();
  // }
}
