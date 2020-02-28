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
    this.setPagination(0, 1);
    this.tableData = rlpData.data;
  }
  setPagination(startIndex, currentPageNumber) {
    this.startIndex = startIndex;
    this.currentPageNumber = currentPageNumber;
  }
  pageSizeMethod() {
    this.totalPages = Math.ceil(rlpData.data.length / +this.selectPageSize);
  }
  prevClick() {
    this.setPagination(this.startIndex - +this.selectPageSize, --this.currentPageNumber);
  }
  nextClick() {
    this.setPagination(this.startIndex + +this.selectPageSize, ++this.currentPageNumber);
  }
}
