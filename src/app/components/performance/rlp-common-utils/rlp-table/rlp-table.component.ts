import { Component, OnInit } from '@angular/core';
import { rlpData, INITIAL_PAGINATION, pageSizeConf } from '../../../../modals/rlp-data';

@Component({
  selector: 'app-rlp-table',
  templateUrl: './rlp-table.component.html',
  styleUrls: ['./rlp-table.component.scss']
})
export class RlpTableComponent implements OnInit {
  public qTinSearch: string; // Input ngModel of Tin Search
  public qGroupNameSearch: string; // Input ngModel of GroupName
  public tableData: any; // This varibale is used for the pipe
  public afterQuery: any; // afterquery is an array of type Table Data and used to check the filtered array of items
  public currentPageNumber: number; // Input the ngModel for page number
  public selectPageSize: string; // Dropdown ngModel select value
  public startIndex: number; // starting point of the items displayed for the current state
  public endIndex: number; // end point of the items displayed for the current state
  public totalPages: number; // total Number of pages i.e. Number of available records/ PageSize
  public pageSizeValues: Array<string>; // Dropdown option values
  constructor() {}

  ngOnInit() {
    this.pageSizeValues = pageSizeConf;
    this.selectPageSize = this.pageSizeValues[0];
    this.tableData = rlpData.data;
    this.afterQuery = this.tableData;
    this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
    this.setPagination();
    this.tableData = rlpData.data;
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
    this.totalPages = Math.ceil(this.afterQuery / +this.selectPageSize);
    this.setPagination(
      this.totalPages < this.currentPageNumber ? this.totalPages : this.currentPageNumber,
      (this.currentPageNumber - 1) * +this.selectPageSize,
      this.currentPageNumber * +this.selectPageSize
    );
  }

  prevClick() {
    this.setPagination(
      --this.currentPageNumber,
      (this.currentPageNumber - 1) * +this.selectPageSize,
      this.currentPageNumber * +this.selectPageSize
    );
  }
  nextClick() {
    this.setPagination(
      ++this.currentPageNumber,
      (this.currentPageNumber - 1) * +this.selectPageSize,
      this.currentPageNumber * +this.selectPageSize
    );
  }

  /**
   * enterQuery() is the function for setting up totalPages dynamically on the basis of search
   * for both Tin and Group name
   */
  enterQuery() {
    this.setPagination();
    if (this.qGroupNameSearch === undefined && this.qTinSearch === undefined) {
      console.log('not yet decided');
    }
    this.afterQuery = this.tableData.filter(el => {
      if (el.tin.indexOf([this.qTinSearch]) !== -1 && this.qGroupNameSearch === undefined) {
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
    });
    this.totalPages = Math.ceil(this.afterQuery.length / +this.selectPageSize);
    console.log('Check after queary', this.afterQuery);
  }

  /**
   * enterPageNumber() is to handle and setup pagination after user enters custom number to go
   * If the entered value is valid it will setup the pagination accordingly otherwise it will
   * Else it will reset the pagination to the INITIAL STATE
   */
  enterPageNumber() {
    if (this.currentPageNumber <= this.totalPages) {
      this.setPagination(
        this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    } else {
      this.setPagination();
      return false;
    }
  }
}
