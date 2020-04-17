import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../shared/session.service';
import { HomeService } from '../../../rest/advocate/home.service';
import { dropdownOptions, IUserResponse } from './user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize, startWith } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
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
  currentPlaceholder: string;
  dropDownArray: Array<Object>;
  selectedDropdown: string;
  searchedString: string;
  getData$: Subscription;
  /** Ends Search Servie variables */
  constructor(
    private fb: FormBuilder,
    private session: SessionService,
    private searchService: HomeService,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private storage: StorageService,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'round-search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    this.dropDownArray = dropdownOptions;
  }

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = `Hi, ${this.userName}.`;
    this.pagesubTitle = 'Welcome to UHC Insights.';
    this.selectedDropdown = this.dropDownArray[0]['value'];
    this.searchBox(this.selectedDropdown);
  }
  displayFn(user: IUserResponse) {
    if (user) {
      if (this.selectedDropdown === 'TinName') {
        return user.TinName;
      } else if (this.selectedDropdown === 'tin') {
        return user.Tin;
      } else {
        this.providerSelect(user);
        return user.ProviderSystem;
      }
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
        switchMap(value =>
          value && value.trim() && value.length > 2 && value.length - value.trim().length < 2
            ? this.searchService
                .search({ searchValue: value.trim(), searchType: dropdownSelection })
                .pipe(finalize(() => (this.isLoading = false)))
            : null
        )
      )
      .subscribe(
        users => (
          ((this.filteredUsers = of(users)), (this.noSearchFound = users.length ? false : true)),
          err => {
            console.log('Error in Advocate Home page', err);
          }
        )
      );
    /** Search code ends here */
  }
  valueDropdown(val: string) {
    this.selectedDropdown = val;
    this.searchBox(this.selectedDropdown);
  }
  onSearchInput(value: string) {
    value && value.trim() ? (this.searchedString = value) : (this.searchedString = '');
  }
  resetForm() {
    this.searchedString = '';
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
    this.router.navigate(['/OverviewPageAdvocate/HealthSystemDetails/']);
  }
  ngOnDestroy() {
    this.getData$.unsubscribe();
  }
}
