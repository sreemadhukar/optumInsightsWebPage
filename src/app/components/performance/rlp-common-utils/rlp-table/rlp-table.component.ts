import { Component, OnInit } from '@angular/core';
import { rlpData } from '../../../../modals/rlp-data';
@Component({
  selector: 'app-rlp-table',
  templateUrl: './rlp-table.component.html',
  styleUrls: ['./rlp-table.component.scss']
})
export class RlpTableComponent implements OnInit {
  private tableData: any;
  private qTinSearch: string;
  private qGroupNameSearch: string;
  constructor() {}

  ngOnInit() {
    this.tableData = rlpData.data;
    console.log(this.tableData);
    console.log(this.qTinSearch, this.qGroupNameSearch);
  }
}
