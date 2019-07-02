import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { Providers } from '../../shared/provider/provider.class';
import { MatIconRegistry, MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
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
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
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
