import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { ProviderSharedService } from './../../../shared/provider/provider-shared.service';
import { Providers } from './../../../shared/provider/provider.class';
import { MatIconRegistry, MatAutocompleteSelectedEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from './../../../shared/storage-service.service';
import { SessionService } from '../../../shared/session.service';
import { NgRedux, select } from '@angular-redux/store';
import { DOCUMENT, Location } from '@angular/common';

import {
  AfterViewInit,
  AfterViewChecked,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  OnDestroy
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/auth/_service/authentication.service';

@Component({
  selector: 'app-select-provider',
  templateUrl: './select-provider.component.html',
  styleUrls: ['./select-provider.component.scss']
})

/**
 * @title Option groups autocomplete
 */
export class SelectProviderComponent implements OnInit {
  stateCtrl = new FormControl();
  ExtstateCtrl = new FormControl();
  filteredStates: Observable<Providers[]>;
  states: Providers[];
  extstates = [];
  externalOrgs = [];
  providerData: any;
  providerSelectedFlag = true;
  nomatchFlag = true;
  noextmatchFlag = true;
  public username: string;
  public checkAdv;
  public checkPro;
  public checkExecutive;
  protected emitter = new EventEmitter<string>();
  public obs: Subscription;
  providersLoaded = false;
  noProviders = false;
  noExtProviders = false;
  isInternal: boolean = environment.internalAccess;
  public advDropdownBool = false;
  public openDropdownBool = false;
  public myView;
  public userView;
  public fullname = '';
  public MsId = '';
  public OptumId = '';
  public EmailId = '';

  constructor(
    private fb: FormBuilder,
    private providerSharedService: ProviderSharedService,
    private iconRegistry: MatIconRegistry,
    private storage: StorageService,
    private router: Router,
    private sessionService: SessionService,
    sanitizer: DomSanitizer,
    private authService: AuthenticationService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();
    this.checkExecutive = this.sessionService.checkExecutiveRole();
    iconRegistry.addSvgIcon(
      'cross',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-clear-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'noData',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );

    // if (!this.states) {
    //   this.providerSharedService.providersList().subscribe(value => (this.states = value));
    // }

    // this.filteredStates = this.stateCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(state => (state ? this._filterStates(state) : null))
    // );
    iconRegistry.addSvgIcon(
      'person',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-person-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'expand-more',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-expand_more-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-menu-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'cross',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-clear-24px.svg')
    );
  }

  ngOnInit() {
    this.advDropdownBool = false;
    this.providerData = JSON.parse(sessionStorage.getItem('currentUser'));
    if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
      const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
      this.username = userInfo.FirstName;
      this.fullname = userInfo.FirstName + ' ' + userInfo.LastName;
      this.MsId = userInfo.MsId;
      this.OptumId = userInfo.OptumId;
      this.EmailId = userInfo.EmailId;
    }

    this.obs = this.emitter.pipe(debounceTime(250)).subscribe(text => this.getProviders(text));

    if (!this.isInternal) {
      this.extstates = this.providerData[0].Providers;
      // this.extstates = [{
      //   "ProviderKey": 35999,
      //   "All": null,
      //   "ProviderSystem": "Aaa Anesthesia Associates"
      // },
      // {
      //   "ProviderKey": 3999,
      //   "All": null,
      //   "ProviderSystem": "Byram Associates"
      // }
      // ];
      this.extstates = this.extstates.map(function(elm) {
        return { Providersyskey: elm['ProviderKey'], Healthcareorganizationname: elm['ProviderSystem'] };
      });
      this.extstates.sort((a, b) => a.Healthcareorganizationname.localeCompare(b.Healthcareorganizationname));
      this.externalOrgs = this.extstates;
    }
  }

  getProviders(text) {
    console.log(text);
    this.providerSharedService.providersList(text).subscribe(value => this.checkCondition(value));
  }

  public checkCondition(value) {
    if (value) {
      this.states = value;
    } else {
      this.states = [];
    }
    this.providersLoaded = true;
    if (document.querySelector('.mat-autocomplete-panel')) {
      (<HTMLElement>document.querySelector('.mat-autocomplete-panel')).style.height = '0';
    }
    if (this.stateCtrl.value && this.stateCtrl.value !== '') {
      if (document.querySelector('.mat-autocomplete-hidden')) {
        (<HTMLElement>document.querySelector('.mat-autocomplete-hidden')).style.visibility = 'visible';
      }
      if (document.querySelector('.mat-autocomplete-panel')) {
        (<HTMLElement>document.querySelector('.mat-autocomplete-panel')).style.height = 'auto';
      }
      // for (let i = 0; i < this.states.length; i++) {
      //   if (!this.states[i].HealthCareOrganizationName.toLowerCase().startsWith(this.stateCtrl.value.toLowerCase())) {
      //     this.nomatchFlag = false;
      //     (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
      //   } else {
      //     (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
      //     this.nomatchFlag = true;
      //     break;
      //   }
      // }
    }
    // if (this.stateCtrl.value === '') {
    //   this.nomatchFlag = true;
    //   (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    // }
    if (this.states.length === 0) {
      this.nomatchFlag = false;
      this.noProviders = true;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
    } else {
      this.nomatchFlag = true;
      this.noProviders = false;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    }
  }
  provider() {
    this.router.navigate(['/ProviderSearch']);
  }
  // madhukar
  providerSelect(event: MatAutocompleteSelectedEvent) {
    // this.providerSelectedFlag = false;
    const provider = this.providerData[0];
    const data = this.states.find(prov => prov.HealthCareOrganizationName === event.option.value);
    if (this.providerData[0].hasOwnProperty('Providersyskey')) {
      provider.healthcareorganizationname = data.HealthCareOrganizationName;
      provider.ProviderKey = data.ProviderKey;
      this.storage.store('currentUser', [provider]);
    } else {
      this.storage.store('currentUser', [Object.assign(provider, data)]);
    }
    // Role based access for Advocates Overview page
    if (this.checkAdv.value) {
      // window.location.href = '/OverviewPageAdvocate';
      window.location.href = '/OverviewPageAdvocate/HealthSystemDetails';
    } else if (this.checkPro.value || this.checkExecutive.value) {
      window.location.href = '/OverviewPage';
    } else {
      window.location.href = '/OverviewPage';
    }
  }

  // private _filterStates(value: string): Providers[] {
  //   const filterValue = value.toLowerCase();
  //   const filteredSet = this.states.filter(
  //     state => state.HealthCareOrganizationName.toLowerCase().indexOf(filterValue) === 0
  //   );
  //   filteredSet.sort((a, b) => a.HealthCareOrganizationName.localeCompare(b.HealthCareOrganizationName));
  //   return filteredSet;
  // }

  ExtproviderSelect(event: MatAutocompleteSelectedEvent) {
    // this.providerSelectedFlag = false;
    const provider = this.providerData[0];
    const data = this.extstates.find(prov => prov.Healthcareorganizationname === event.option.value);
    if (this.providerData[0].hasOwnProperty('Providersyskey')) {
      provider.Healthcareorganizationname = data.Healthcareorganizationname;
      provider.Providersyskey = data.Providersyskey;
      this.storage.store('currentUser', [provider]);
    } else {
      this.storage.store('currentUser', [Object.assign(provider, data)]);
    }
    // Role based access for Advocates Overview page
    if (this.checkAdv.value) {
      // window.location.href = '/OverviewPageAdvocate';
      window.location.href = '/OverviewPageAdvocate/HealthSystemDetails';
    } else if (this.checkPro.value || this.checkExecutive.value) {
      window.location.href = '/OverviewPage';
    } else {
      window.location.href = '/OverviewPage';
    }
  }

  check(val) {
    this.nomatchFlag = true;
    this.noProviders = false;
    (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    if (val.length >= 3) {
      this.emitter.emit(val);
    } else {
      this.states = [];
    }
  }
  extProviders(val) {
    this.noextmatchFlag = true;
    this.noExtProviders = false;
    this.extstates = this.externalOrgs.filter(
      el => el.Healthcareorganizationname.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    (<HTMLElement>document.querySelector('.mat-autocomplete-hidden')).style.visibility = 'visible';

    (<HTMLElement>document.querySelector('.mat-autocomplete-panel')).style.height = 'auto';

    if (this.extstates.length === 0) {
      this.noextmatchFlag = false;
      this.noExtProviders = true;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
    } else {
      this.noextmatchFlag = true;
      this.noExtProviders = false;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    }
  }

  advocateUserClicked() {
    console.log('this.checkAdv()', this.checkAdv.value);
    if (this.sessionService.checkRole('UHCI_Advocate')) {
      this.advDropdownBool = true;
    } else {
      this.advDropdownBool = false;
    }
    this.toggler();
  }

  toggler() {
    this.openDropdownBool = !this.openDropdownBool;
  }

  advViewClicked(value: string) {
    if (value === 'myView') {
      // this.sessionService.checkedClicked.myView = true;
      // this.checkedClicked.myView = this.sessionService.checkedClicked.myView;

      // this.sessionService.checkedClicked.provider = false;
      // this.checkedClicked.provider = this.sessionService.checkedClicked.provider;
      this.myView = true;
      this.userView = false;
      this.router.navigate(['/OverviewPageAdvocate']);
    } else if (value === 'userView') {
      // this.sessionService.checkedClicked.myView = false;
      // this.checkedClicked.myView = this.sessionService.checkedClicked.myView;

      // this.sessionService.checkedClicked.provider = true;
      // this.checkedClicked.provider = this.sessionService.checkedClicked.provider;
      this.userView = true;
      this.myView = false;
      this.router.navigate(['/OverviewPage']);
    }
    this.openDropdownBool = false;
  }

  signOut() {
    this.openDropdownBool = false;
    this.authService.logout();
    if (!environment.internalAccess) {
      this.document.location.href = environment.apiUrls.SsoLogoutUrl;
    }
  }
}
