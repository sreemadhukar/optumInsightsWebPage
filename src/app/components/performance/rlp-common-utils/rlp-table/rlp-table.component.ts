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
    this.setPagination(0, this.selectPageSize, 1);
    this.tableData = rlpData.data;
  }
  setPagination(startIndex, endIndex, currentPageNumber) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.currentPageNumber = currentPageNumber;
  }
  pageSizeMethod() {
    this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
  }
  prevClick() {
    this.setPagination(
      (this.currentPageNumber - 2) * +this.selectPageSize,
      (this.currentPageNumber - 1) * +this.selectPageSize,
      --this.currentPageNumber
    );
  }
  nextClick() {
    this.setPagination(
      (this.currentPageNumber - 1) * +this.selectPageSize,
      this.currentPageNumber * +this.selectPageSize,
      ++this.currentPageNumber
    );
  }
}
