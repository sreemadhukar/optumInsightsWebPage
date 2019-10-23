import { Component, OnInit, AfterViewInit, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { Providers } from '../../shared/provider/provider.class';
import {
  MatIconRegistry,
  MatDialogRef,
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
  MAT_DIALOG_DATA
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../shared/storage-service.service';
import get from 'lodash.get';
const DEFAULT_SELECTED_ACTION = () => {};
const DEFAULT_CONTAINER_LABEL = 'Select an organization to represent';

@Component({
  selector: 'app-provider-search',
  templateUrl: './provider-search.component.html',
  styleUrls: ['./provider-search.component.scss']
})
export class ProviderSearchComponent implements OnInit, AfterViewInit {
  stateCtrl = new FormControl();
  filteredStates: Observable<Providers[]>;
  states: Providers[];
  providerData: any;
  nomatchFlag: any;

  // Set default value for the container title label
  containerLabel = DEFAULT_CONTAINER_LABEL;

  // Set default function, trigres after selecting provider value
  valueSelected = DEFAULT_SELECTED_ACTION;

  protected emitter = new EventEmitter<string>();
  public obs: Subscription;
  providersLoaded = false;
  noProviders = false;

  constructor(
    private fb: FormBuilder,
    private providerSharedService: ProviderSharedService,
    private iconRegistry: MatIconRegistry,
    private storage: StorageService,
    private dialogRef: MatDialogRef<ProviderSearchComponent>,
    private router: Router,
    sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    // Set optional label value from parent component
    this.containerLabel = get(this.data, ['containerLabel'], this.containerLabel);

    // Set optional function value from parent component that trigres after value selected
    this.valueSelected = get(this.data, ['valueSelected'], this.valueSelected);
  }

  ngOnInit() {
    // if (!this.states) {
    //   this.providerSharedService.providersList().subscribe(value => (this.states = value));
    // }

    // this.filteredStates = this.stateCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(state => (state ? this._filterStates(state) : null))
    // );

    this.providerData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.nomatchFlag = true;

    // To close the provider dialog box on clicking outside
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close();
    });

    this.obs = this.emitter.pipe(debounceTime(250)).subscribe(text => this.getProviders(text));
  }

  ngAfterViewInit() {
    // if (!this.states) {
    //   this.providerSharedService.providersList().subscribe(value => (this.states = value));
    // }
    // this.filteredStates = this.stateCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map(state => (state ? this._filterStates(state) : null))
    // );
  }
  providerSelect(event: MatAutocompleteSelectedEvent) {
    const provider = this.providerData[0];
    const data = this.states.find(prov => prov.HealthCareOrganizationName === event.option.value);
    if (this.providerData[0].hasOwnProperty('Providersyskey')) {
      provider.healthcareorganizationname = data.HealthCareOrganizationName;
      provider.ProviderKey = data.ProviderKey;
      this.storage.store('currentUser', [provider]);
    } else {
      this.storage.store('currentUser', [Object.assign(provider, data)]);
    }
    this.storage.emitEvent('overviewPage');
    this.dialogRef.close();
    this.valueSelected();
  }

  close() {
    this.dialogRef.close();
  }

  getProviders(text) {
    console.log(text);
    this.providerSharedService.providersList(text).subscribe(value => this.checkCondition(value));
  }

  // author: madhukar date: 16/7/2109 for provider not found
  checkCondition(value) {
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
      //     (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#B10C00';
      //     (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
      //   } else {
      //     (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#196ECF';
      //     (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
      //     this.nomatchFlag = true;
      //     break;
      //   }
      // }
    }
    if (this.stateCtrl.value === '') {
      if (document.querySelector('.mat-autocomplete-hidden')) {
        (<HTMLElement>document.querySelector('.mat-autocomplete-hidden')).style.visibility = 'hidden';
      }
      if (!(<HTMLElement>document.querySelector('.mat-focused'))) {
        (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#757588';
        (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = 'black';
      } else {
        (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
        (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#196ECF';
      }
    }
    if (this.stateCtrl.value === '') {
      this.nomatchFlag = true;
      (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
    }

    // madhukar

    //  return true;
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
    this.dialogRef.close();
  }

  // private _filterStates(value: string): Providers[] {
  //   const filterValue = value.toLowerCase();
  //   const filteredSet = this.states.filter(
  //     state => state.HealthCareOrganizationName.toLowerCase().indexOf(filterValue) === 0
  //   );
  //   filteredSet.sort((a, b) => a.HealthCareOrganizationName.localeCompare(b.HealthCareOrganizationName));
  //   return filteredSet;
  // }

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
}
