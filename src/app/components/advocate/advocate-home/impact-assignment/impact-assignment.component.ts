import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from '../../../../rest/advocate/home.service';
import { SessionService } from '../../../../shared/session.service';
import { IUserResponse, IAdvTinDetailsResponse, pageSizeConf, INITIAL_PAGINATION } from '../user.class';
import { Subscription, Observable, of } from 'rxjs';
@Component({
  selector: 'app-impact-assignment',
  templateUrl: './impact-assignment.component.html',
  styleUrls: ['./impact-assignment.component.scss']
})
export class ImpactAssignmentComponent implements OnInit, OnDestroy {
  public completeData: any;
  public getData$: Subscription;
  public searchInput: string; // Input ngModel of Impact assignment search
  public afterQuery: any; // afterquery is an array of type Table Data and used to check the filtered array of items
  public currentPageNumber: number; // Input the ngModel for page number
  public selectPageSize: string; // Dropdown ngModel select value
  public startIndex: number; // starting point of the items displayed for the current state
  public endIndex: number; // end point of the items displayed for the current state
  public totalPages: number; // total Number of pages i.e. Number of available records/ PageSize
  public pageSizeValues: Array<string>; // Dropdown option values
  public showTable: boolean;
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private homeService: HomeService,
    private session: SessionService
  ) {
    iconRegistry.addSvgIcon(
      'star',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/star-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'round-search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'downarrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/arrow_downward.svg')
    );
    iconRegistry.addSvgIcon(
      'rightarrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/chevron_right-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'leftarrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/chevron_left-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    // 'gpalomi1'
    // this.session.sessionStorage('loggedUser', 'MsId')
    this.pageSizeValues = [...pageSizeConf];
    this.selectPageSize = this.pageSizeValues[0];
    this.showTable = false;
    this.getData$ = this.homeService.getAdvDetails('gpalomi1').subscribe(
      data => {
        this.completeData = [...data];
        this.afterQuery = [...this.completeData];
        this.totalPages = Math.ceil(this.completeData.length / +this.selectPageSize);
        this.showTable = true;
        this.setPagination();
        console.log('Data', data);
      },
      err => {
        console.log('Error Advocate home page', err);
      }
    );
  }

  resetSearch() {
    this.searchInput = '';
  }
  /**
   * setPagination function handle the current state of pagination
   * @param currentPageNumber  Current page if not provided INITIAL_STATE i.e. 1
   * @param startIndex StartIndex of the current state of the table if not provided INITIAL_STATE i.e. 0
   * @param endIndex EndIndex of the current state of the table if not provided INITIAL_STATE i.e default page size
   */
  setPagination(
    currentPageNumber = INITIAL_PAGINATION.currentPageNumber,
    startIndex = INITIAL_PAGINATION.setIndex,
    endIndex = INITIAL_PAGINATION.endIndex
  ) {
    this.currentPageNumber = currentPageNumber;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }

  /**
   * pageSizeMethod() function handle the list of items to be displayed at one instance
   * Based on the user selection of the size, totalPages is calculated
   * SetPagination is called considering the current state of the table
   * Example:
   * user is at Page 2 and then he selects number of items to displayed from 4 to 8
   * Now, currentPageNumber will hold the current state i.e. 2 and adjust the startIndex and endIndex accordingly
   */
  pageSizeMethod() {
    this.totalPages = Math.ceil(this.afterQuery.length / +this.selectPageSize);
    if (this.totalPages < this.currentPageNumber) {
      this.setPagination(
        this.totalPages,
        (this.totalPages - 1) * +this.selectPageSize,
        this.totalPages * +this.selectPageSize
      );
    } else {
      this.setPagination(
        this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    }
  }

  prevClick() {
    if (this.currentPageNumber > 1) {
      this.setPagination(
        --this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    }
  }
  nextClick() {
    if (this.currentPageNumber < this.totalPages) {
      this.setPagination(
        ++this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    }
  }

  /**
   * enterQuery() is the function for setting up totalPages dynamically on the basis of search
   * for both Tin and Group name
   */
  enterQuery() {
    this.setPagination(1, 0, +this.selectPageSize);
    if (this.searchInput === undefined) {
      console.log('Inputs are empty');
    }
    this.afterQuery = this.completeData.filter(el => {
      return el;
      // if (el.tin.indexOf([this.qTinSearch]) !== -1 && this.qGroupNameSearch === undefined) {
      //   return true;
      // } else if (
      //   this.qTinSearch === undefined &&
      //   el.groupName.toLowerCase().indexOf([this.qGroupNameSearch.toLowerCase()]) !== -1
      // ) {
      //   return true;
      // } else if (
      //   el.tin.indexOf([this.qTinSearch]) !== -1 &&
      //   el.groupName.toLowerCase().indexOf([this.qGroupNameSearch.toLowerCase()]) !== -1
      // ) {
      //   return true;
      // }
    });

    this.totalPages = Math.ceil(this.afterQuery.length / +this.selectPageSize);
  }

  /**
   * enterPageNumber() is to handle and setup pagination after user enters custom number to go
   * If the entered value is valid it will setup the pagination accordingly otherwise it will
   */
  enterPageNumber() {
    if (this.currentPageNumber <= this.totalPages) {
      this.setPagination(
        this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.getData$.unsubscribe();
  }
}
