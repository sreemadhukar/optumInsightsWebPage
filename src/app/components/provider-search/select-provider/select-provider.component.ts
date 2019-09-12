import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProviderSharedService } from './../../../shared/provider/provider-shared.service';
import { Providers } from './../../../shared/provider/provider.class';
import { MatIconRegistry, MatAutocompleteSelectedEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from './../../../shared/storage-service.service';

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
  filteredStates: Observable<Providers[]>;
  states: Providers[];
  providerData: any;
  providerSelectedFlag = true;
  nomatchFlag = true;
  public username: string;

  constructor(
    private fb: FormBuilder,
    private providerSharedService: ProviderSharedService,
    private iconRegistry: MatIconRegistry,
    private storage: StorageService,
    private router: Router,
    sanitizer: DomSanitizer
  ) {
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

    if (!this.states) {
      this.providerSharedService.providersList().subscribe(value => (this.states = value));
    }

    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : null))
    );
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
    this.providerData = JSON.parse(sessionStorage.getItem('currentUser'));
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.username = userInfo.FirstName;
  }

  public checkCondition() {
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
      for (let i = 0; i < this.states.length; i++) {
        if (!this.states[i].HealthCareOrganizationName.toLowerCase().startsWith(this.stateCtrl.value.toLowerCase())) {
          this.nomatchFlag = false;
          (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
        } else {
          (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
          this.nomatchFlag = true;
          break;
        }
      }
    }
    if (this.stateCtrl.value === '') {
      this.nomatchFlag = true;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    }
    return true;
  }
  provider() {
    this.router.navigate(['/ProviderSearch']);
  }
  // madhukar
  providerSelect(event: MatAutocompleteSelectedEvent) {
    this.providerSelectedFlag = false;
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
    try {
      if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
        let userRole;
        userRole = JSON.parse(sessionStorage.getItem('loggedUser')).UserRole;
        let userRoleAdvocate = false;
        userRoleAdvocate = userRole.some(item => item.includes('UHCI_Advocate'));
        if (!userRoleAdvocate) {
          this.router.navigate(['/OverviewPage']);
        }
      }
    } catch (Error) {
      this.router.navigate(['/OverviewPage']);
    }
  }

  private _filterStates(value: string): Providers[] {
    const filterValue = value.toLowerCase();
    const filteredSet = this.states.filter(
      state => state.HealthCareOrganizationName.toLowerCase().indexOf(filterValue) === 0
    );
    filteredSet.sort((a, b) => a.HealthCareOrganizationName.localeCompare(b.HealthCareOrganizationName));
    return filteredSet;
  }
}
