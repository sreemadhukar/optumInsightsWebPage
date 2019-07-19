import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { Providers } from '../../shared/provider/provider.class';
import { MatIconRegistry, MatDialogRef, MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../shared/storage-service.service';

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

  constructor(
    private fb: FormBuilder,
    private providerSharedService: ProviderSharedService,
    private iconRegistry: MatIconRegistry,
    private storage: StorageService,
    private dialogRef: MatDialogRef<ProviderSearchComponent>,
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
  }

  ngOnInit() {
    if (!this.states) {
      this.providerSharedService.providersList().subscribe(value => (this.states = value));
    }

    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : null))
    );

    this.providerData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.nomatchFlag = true;
  }

  ngAfterViewInit() {
    if (!this.states) {
      this.providerSharedService.providersList().subscribe(value => (this.states = value));
    }

    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : null))
    );
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
    console.log('storage', this.storage);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  // author: madhukar date: 16/7/2109 for provider not found
  checkCondition() {
    if (document.querySelector('.mat-autocomplete-panel')) {
      (<HTMLElement>document.querySelector('.mat-autocomplete-panel')).style.height = '0';
    }
    if (this.stateCtrl.value && this.stateCtrl.value !== '') {
      if (document.querySelector('.mat-autocomplete-panel')) {
        (<HTMLElement>document.querySelector('.mat-autocomplete-panel')).style.height = 'auto';
      }
      for (let i = 0; i < this.states.length; i++) {
        if (!this.states[i].HealthCareOrganizationName.toLowerCase().startsWith(this.stateCtrl.value.toLowerCase())) {
          this.nomatchFlag = false;
          (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#B10C00';
          (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#B10C00';
        } else {
          (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#196ECF';
          (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
          this.nomatchFlag = true;
          break;
        }
      }
    }
    if (this.stateCtrl.value === '') {
      if (!(<HTMLElement>document.querySelector('.mat-focused'))) {
        (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#757588';
        (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = 'black';
      } else {
        (<HTMLElement>document.querySelector('.mat-form-field-outline-thick')).style.color = '#196ECF';
        (<HTMLElement>document.querySelector('.mat-form-field-label')).style.color = '#196ECF';
      }
    }

    // madhukar

    return true;
  }
  provider() {
    this.router.navigate(['/ProviderSearch']);
    this.dialogRef.close();
  }

  private _filterStates(value: string): Providers[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.HealthCareOrganizationName.toLowerCase().indexOf(filterValue) === 0);
  }
}
