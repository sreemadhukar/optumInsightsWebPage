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
  private tableData: any;
  private pageNumber: number;
  private selectPageSize: string;
  private startIndex;
  private endIndex;
  private totalPages: number;
  private pageSize = ['2', '4', '6', '8', '25'];
  constructor() {}

  ngOnInit() {
    this.setPagination(this.pageSize[0], 0, this.pageSize[0], 1, rlpData.data.length / this.pageSize.length);
    this.tableData = rlpData.data;
    console.log(this.tableData);
    console.log(this.qTinSearch, this.qGroupNameSearch);
  }
  setPagination(pageSize, startIndex, endIndex, pageNumber, totalPages) {
    this.selectPageSize = pageSize;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.pageNumber = pageNumber;
    this.totalPages = totalPages;
  }
  prevClick() {}
  nextClick() {}
}
