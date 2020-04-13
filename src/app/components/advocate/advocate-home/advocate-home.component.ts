import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/session.service';
import { HomeService } from '../../../rest/advocate/home.service';
import { User, IUserResponse } from './user.class';
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
  /** Ends Search Servie variables */
  constructor(private fb: FormBuilder, private session: SessionService, private searchService: HomeService) {}

  ngOnInit() {
    this.userName = this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = `Hi, ${this.userName}.`;
    this.pagesubTitle = 'Welcome to UHC Insights.';
    /** Search code starts here */
    this.usersForm = this.fb.group({
      userInput: null
    });

    this.currentPlaceholder = 'Search By HCO';
    this.usersForm
      .get('userInput')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(value => this.searchService.search({ name: value }, 1).pipe(finalize(() => (this.isLoading = false))))
      )
      .subscribe(users => (this.filteredUsers = users));
    /** Search code ends here */
  }
  displayFn(user: User) {
    if (user) {
      return user.TinName;
    }
  }
}
