import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../shared/session.service';
import { HomeService } from '../../../rest/advocate/home.service';
import { dropdownOptions, IUserResponse } from './user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-advocate-home',
  templateUrl: './advocate-home.component.html',
  styleUrls: ['./advocate-home.component.scss']
})
export class AdvocateHomeComponent implements OnInit, OnDestroy {
  pageTitle: string;
  pagesubTitle: string;
  userName;
  /** Search Servie variables */
  filteredUsers: Observable<Array<any>>;
  usersForm: FormGroup;
  isLoading: Boolean = false;
  noSearchFound: Boolean = false;
  minCharacterType: Number = 3;
  noResponseMessage: string;
  currentPlaceholder: string;
  dropDownArray: Array<Object>;
  selectedDropdown: string;
  searchedString: string;
  blankInput: Boolean = false;
  getData$: Subscription;
  /** Ends Search Servie variables */
  constructor(
    private fb: FormBuilder,
    private session: SessionService,
    private searchService: HomeService,
    private iconRegistry: MatIconRegistry,
    private storage: StorageService,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'round-search',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    this.dropDownArray = dropdownOptions;
  }

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = `Hi, ${this.userName}.`;
    this.pagesubTitle = 'Welcome to UHC Insights.';
    this.noResponseMessage = `Please type at least ${this.minCharacterType} characters to start your search...`;
    this.selectedDropdown = this.dropDownArray[0]['value'];
    this.searchBox(this.selectedDropdown);
  }
  assignSearchString(val: string = '') {
    this.searchedString = val;
  }
  displayFn(user: IUserResponse): string {
    if (user) {
      this.providerSelect(user);
      if (this.selectedDropdown === 'TinName') {
        return user.TinName;
      } else if (this.selectedDropdown === 'tin') {
        return user.Tin;
      } else {
        return user.ProviderSystem;
      }
    } else {
      return null;
    }
  }
  displayFnWrapper() {
    return item => this.displayFn(item);
  }
  searchBox(dropdownSelection: string) {
    /** Search code starts here */
    this.usersForm = this.fb.group({
      userInput: null
    });
    this.currentPlaceholder =
      'Search By ' + this.dropDownArray.filter(item => item['value'] === dropdownSelection)[0]['viewValue'];
    this.getData$ = this.usersForm
      .get('userInput')
      .valueChanges.pipe(
        debounceTime(200),
        tap(() => (this.isLoading = true)),
        switchMap(value => {
          const str = value.trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          // const str = value.trim().replace(/[^a-zA-Z0-9]/g, '');
          if (this.selectedDropdown === 'tin' && value && value.length >= 3) {
            value = value.slice(0, 2) + '-' + value.slice(2);
          }
          return value &&
            str &&
            value.length >= this.minCharacterType &&
            str.length >= this.minCharacterType &&
            value.length - str.length < 2
            ? this.searchService
                .search({ searchValue: value, searchType: dropdownSelection })
                .pipe(finalize(() => (this.isLoading = false)))
            : null;
        })
      )
      .subscribe(
        users => {
          this.filteredUsers = of(users);
          if (users && users.length) {
            this.noSearchFound = false;
          } else {
            this.noSearchFound = true;
            this.noResponseMessage = 'No Result found for your input search';
          }
        },
        err => {
          console.log('Error in Advocate Home page', err);
        }
      );
    /** Search code ends here */
  }
  valueDropdown(val: string) {
    this.assignSearchString();
    this.selectedDropdown = val;
    this.searchBox(this.selectedDropdown);
  }
  onSearchInput(value: string) {
    this.blankInput = false;
    const str = value.trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // const str = value.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (this.selectedDropdown === 'tin' && value.length >= 3) {
      value = value.slice(0, 2) + '-' + value.slice(2);
    }
    if (!value || value.length < this.minCharacterType) {
      this.noResponseMessage = `Please type at least ${this.minCharacterType} characters to start your search...`;
    } else if (!str || (str.length < this.minCharacterType && value.length - str.length < 2)) {
      this.noResponseMessage = 'Please type valid characters to start your search...';
    }
    value &&
    str &&
    value.length >= this.minCharacterType &&
    str.length >= this.minCharacterType &&
    value.length - str.length < 2
      ? this.assignSearchString(value)
      : this.assignSearchString();
  }
  onSearchClick(value: string) {
    if (value.length === 0) {
      this.assignSearchString();
      this.blankInput = true;
      this.noResponseMessage = `Please type at least ${this.minCharacterType} characters to start your search...`;
    }
  }
  resetForm() {
    this.assignSearchString();
    this.usersForm.reset();
    this.isLoading = true;
  }
  providerSelect(user: IUserResponse) {
    const providerData = JSON.parse(sessionStorage.getItem('currentUser'));
    const provider = providerData[0];
    if (providerData[0].hasOwnProperty('Providersyskey')) {
      provider.healthcareorganizationname = user.ProviderSystem;
      provider.ProviderKey = user.ProviderSysKey;
      this.storage.store('currentUser', [provider]);
    } else {
      const providerObj = {
        HealthCareOrganizationName: user.ProviderSystem,
        ProviderKey: user.ProviderSysKey
      };
      this.storage.store('currentUser', [Object.assign(provider, providerObj)]);
    }
    window.location.href = '/OverviewPageAdvocate/HealthSystemDetails/';
  }
  ngOnDestroy() {
    this.getData$.unsubscribe();
  }
}
