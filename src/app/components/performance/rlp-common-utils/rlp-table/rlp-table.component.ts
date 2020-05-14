import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { INITIAL_PAGINATION, pageSizeConf } from '../../../../modals/rlp-data';

@Component({
  selector: 'app-rlp-table',
  templateUrl: './rlp-table.component.html',
  styleUrls: ['./rlp-table.component.scss']
})
export class RlpTableComponent implements OnInit, OnDestroy {
  @Input() data;
  @Input() skeletonTable;
  public qTinSearch: string; // Input ngModel of Tin Search
  public qGroupNameSearch: string; // Input ngModel of GroupName
  public tableData: any; // This varibale is used for the pipe
  public tableHeader: Array<string>;
  public afterQuery: any; // afterquery is an array of type Table Data and used to check the filtered array of items
  public currentPageNumber: number; // Input the ngModel for page number
  public selectPageSize: string; // Dropdown ngModel select value
  public startIndex: number; // starting point of the items displayed for the current state
  public endIndex: number; // end point of the items displayed for the current state
  public totalPages: number; // total Number of pages i.e. Number of available records/ PageSize
  public pageSizeValues: Array<string>; // Dropdown option values
  public isAscending: boolean; // used to check sorting of the table
  public isAscending1: boolean; // used to check sorting of the table
  public isAscending2: boolean; // used to check sorting of the table
  public showTableBody: boolean;
  public showTableHeader: boolean;
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'arrow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'downarrow',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/arrow_downward.svg')
    );
    this.iconRegistry.addSvgIcon(
      'rightarrow',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/chevron_right-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'leftarrow',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/chevron_left-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  ngOnInit() {
    this.pageSizeValues = [...pageSizeConf];
    this.selectPageSize = this.pageSizeValues[0];
    this.tableData = [...this.data.tbody];
    this.afterQuery = [...this.tableData];
    this.totalPages = Math.ceil(this.tableData.length / +this.selectPageSize);
    this.sortTableData();
    this.setPagination();
    this.isAscending = true;
    this.isAscending1 = true;
    this.isAscending2 = true;
    this.tableHeader = this.data.thead;
    this.showTableBody = true;
    this.showTableHeader = true;
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
   * sortTableData function handle the sorting of the table
   * @param asc  boolean value by default ascending = true
   * @param param  param value defined by which table needs to be sorted
   */
  sortTableData(asc: boolean = true) {
    return asc
      ? this.tableData.sort((a, b) => a.graphData.data.gdata.percentage - b.graphData.data.gdata.percentage)
      : this.tableData.sort((b, a) => a.graphData.data.gdata.percentage - b.graphData.data.gdata.percentage);
  }

  /**
   * sortIconClicked() is the function to which is called onClick of sort icon clicked of total
   */
  sortIconRate() {
    this.isAscending = !this.isAscending;
    this.tableData = [...this.sortTableData(this.isAscending)];
  }

  sortGroupNameData(asc: boolean = true) {
    return asc
      ? this.tableData.sort((a, b) => (a.groupName < b.groupName ? 1 : a.groupName > b.groupName ? -1 : 0))
      : this.tableData.sort((b, a) => (a.groupName < b.groupName ? 1 : a.groupName > b.groupName ? -1 : 0));
  }

  sortGroupName() {
    this.isAscending = !this.isAscending;
    this.tableData = [...this.sortGroupNameData(this.isAscending)];
  }

  sortTinData(asc: boolean = true) {
    return asc
      ? this.tableData.sort((a, b) => (a.tin < b.tin ? 1 : a.tin > b.tin ? -1 : 0))
      : this.tableData.sort((b, a) => (a.tin < b.tin ? 1 : a.tin > b.tin ? -1 : 0));
  }

  sortTin() {
    this.isAscending = !this.isAscending;
    this.tableData = [...this.sortTinData(this.isAscending)];
  }
  /**
   * enterQuery() is the function for setting up totalPages dynamically on the basis of search
   * for both Tin and Group name
   */
  enterQuery() {
    this.setPagination(1, 0, +this.selectPageSize);
    if (this.qGroupNameSearch === undefined && this.qTinSearch === undefined) {
      console.log('Inputs are empty');
    }
    if (this.qTinSearch) {
      this.qTinSearch = this.qTinSearch.trim().replace(/[^0-9]/g, '');
      if (this.qTinSearch.length > 2) {
        this.qTinSearch = this.qTinSearch.slice(0, 2) + '-' + this.qTinSearch.slice(2);
      }
    }

    const regexTinSearch = new RegExp(`${this.qTinSearch}`, 'ig');
    const regexGroupName = new RegExp(`${this.qGroupNameSearch}`, 'ig');
    this.afterQuery = this.tableData.filter(el => regexTinSearch.test(el.tin) || regexGroupName.test(el.groupName));

    /* this.afterQuery = this.tableData.filter(el => {
      if (el.tin.indexOf([this.qTinSearch]) !== -1 &&
        this.qGroupNameSearch === undefined) {
        return true;
      } else if (
        this.qTinSearch === undefined &&
        el.groupName.toLowerCase().indexOf([this.qGroupNameSearch.toLowerCase()]) !== -1
      ) {
        return true;
      } else if (
        el.tin.indexOf([this.qTinSearch]) !== -1 &&
        el.groupName.toLowerCase().indexOf([this.qGroupNameSearch.toLowerCase()]) !== -1
      ) {
        return true;
      }
    });*/

    this.totalPages = Math.ceil(this.afterQuery.length / +this.selectPageSize);
    this.setPagination(this.totalPages !== 0 ? 1 : 0, 0, +this.selectPageSize);
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

  clearValue(value) {
    if (value === 'qTinSearch') {
      this.qTinSearch = '';
    }
    if (value === 'qGroupNameSearch') {
      this.qGroupNameSearch = '';
    }
    this.enterQuery();
  }

  ngOnDestroy() {}
}
