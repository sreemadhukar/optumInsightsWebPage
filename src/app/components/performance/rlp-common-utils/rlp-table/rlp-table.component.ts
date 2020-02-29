import { Component, OnInit } from '@angular/core';
import { rlpData } from '../../../../modals/rlp-data';
@Component({
  selector: 'app-rlp-table',
  templateUrl: './rlp-table.component.html',
  styleUrls: ['./rlp-table.component.scss']
})
export class RlpTableComponent implements OnInit {
  public qTinSearch: string;
  public qGroupNameSearch: string;
  public tableData: any;
  public currentPageNumber: number;
  public selectPageSize: string;
  public startIndex;
  public endIndex;
  public totalPages: number;
  public pageSize = ['2', '4', '6', '8', '25'];
  constructor() {}

  ngOnInit() {
    this.selectPageSize = this.pageSize[0];
    this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
    this.setPagination(1, 0, this.selectPageSize);
    this.tableData = rlpData.data;
  }
  setPagination(currentPageNumber, startIndex, endIndex) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.currentPageNumber = currentPageNumber;
    console.log('start', startIndex, 'end', endIndex, 'current ', currentPageNumber);
  }
  pageSizeMethod() {
    this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
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
  enterQuery() {
    this.setPagination(1, 0, this.selectPageSize);
    if (this.qGroupNameSearch === undefined && this.qTinSearch === undefined) {
      console.log('Check after queary undefeined');
    }
    const afterQuery = this.tableData.filter(el => {
      if (el.tin.indexOf([this.qTinSearch]) !== -1 && this.qGroupNameSearch === undefined) {
        return true;
      } else if (this.qTinSearch === undefined && el.groupName.toLowerCase().indexOf([this.qGroupNameSearch]) !== -1) {
        return true;
      } else if (
        el.tin.indexOf([this.qTinSearch]) !== -1 &&
        el.groupName.toLowerCase().indexOf([this.qGroupNameSearch]) !== -1
      ) {
        return true;
      }
    });
    // this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
    console.log('Check after queary', afterQuery);
  }

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
}
