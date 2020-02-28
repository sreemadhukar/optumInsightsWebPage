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
  private pageSize = ['2', '4', '6', '8'];
  constructor() {}

  ngOnInit() {
    this.selectPageSize = this.pageSize[0];
    this.pageNumber = 1;
    this.tableData = rlpData.data;
    console.log(this.tableData);
    console.log(this.qTinSearch, this.qGroupNameSearch);
  }
  revClick() {}
  nextClick() {}
}
