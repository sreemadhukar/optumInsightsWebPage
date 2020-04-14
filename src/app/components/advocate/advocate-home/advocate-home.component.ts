import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/session.service';
import { HomeService } from '../../../rest/advocate/home.service';
import { dropdownOptions, IUserResponse } from './user.class';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-advocate-home',
  templateUrl: './advocate-home.component.html',
  styleUrls: ['./advocate-home.component.scss']
})
export class AdvocateHomeComponent implements OnInit {
  pageTitle: String;
  pagesubTitle: String;
  userName;
  /** Search Servie variables */
  filteredUsers: any = [];
  usersForm: FormGroup;
  isLoading = false;
  currentPlaceholder: string;
  dropDownArray: Array<Object>;
  selectedDropdown: string;
  /** Ends Search Servie variables */
  constructor(private fb: FormBuilder, private session: SessionService, private searchService: HomeService) {
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
      return user.TinName;
    }
  }
  searchBox(dropdownSelection: string) {
    /** Search code starts here */
    this.usersForm = this.fb.group({
      userInput: null
    });

    this.currentPlaceholder = this.dropDownArray.find(item => item['value'] === dropdownSelection)[
      'currentPlaceholder'
    ];
    this.usersForm
      .get('userInput')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.searchService
            .search({ searchValue: value, searchType: dropdownSelection })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe(users => (this.filteredUsers = users));
    /** Search code ends here */
  }
  valueDropdown(val) {
    this.selectedDropdown = val;
    this.searchBox(this.selectedDropdown);
  }
}
