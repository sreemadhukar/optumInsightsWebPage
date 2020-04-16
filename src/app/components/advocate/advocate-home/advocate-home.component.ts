import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../shared/session.service';
import { HomeService } from '../../../rest/advocate/home.service';
import { dropdownOptions, IUserResponse } from './user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

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
  filteredUsers: any = [];
  usersForm: FormGroup;
  isLoading = false;
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
    this.searchService
      .search({ searchValue: 'Nov', searchType: 'hco' })
      .subscribe(data => console.log('constrinct', data));
  }
  displayFn(user: IUserResponse) {
    if (user) {
      if (this.selectedDropdown === 'TinName') {
        return user.TinName;
      } else if (this.selectedDropdown === 'tin') {
        return user.Tin;
      } else {
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
      'Search By ' + this.dropDownArray.find(item => item['value'] === dropdownSelection)['viewValue'];
    this.getData$ = this.usersForm
      .get('userInput')
      .valueChanges.pipe(
        debounceTime(200),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          value && value.length > 2
            ? this.searchService
                .search({ searchValue: value, searchType: dropdownSelection })
                .pipe(finalize(() => (this.isLoading = false)))
            : null
        )
      )
      .subscribe(
        users => (
          (this.filteredUsers = users),
          err => {
            console.log('Error in Advocate Home page', err);
          }
        )
      );
    /** Search code ends here */
  }
  valueDropdown(val) {
    this.selectedDropdown = val;
    this.searchBox(this.selectedDropdown);
  }
  onSearchInput(value: string) {
    value ? (this.searchedString = value) : (this.searchedString = '');
  }
  ngOnDestroy() {
    this.getData$.unsubscribe();
  }
}
