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
  enterGroupName() {
    this.startIndex = 0;
  }
  enterTinNumber() {
    this.startIndex = 0;
  }
  enterNumberPage(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    } else if (this.currentPageNumber > this.totalPages) {
      this.currentPageNumber = 1;
      event.preventDefault();
    } else {
      this.setPagination(
        this.currentPageNumber,
        (this.currentPageNumber - 1) * +this.selectPageSize,
        this.currentPageNumber * +this.selectPageSize
      );
    }
  }
}
