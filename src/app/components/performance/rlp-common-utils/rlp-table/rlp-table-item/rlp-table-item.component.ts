import { Component, OnInit, Input } from '@angular/core';

interface IListItem {
  tin: string;
  groupName: string;
  graphData: any;
}
@Component({
  selector: 'app-rlp-table-item',
  templateUrl: './rlp-table-item.component.html',
  styleUrls: ['./rlp-table-item.component.scss']
})
export class RlpTableItemComponent implements OnInit {
  @Input() tableItem: IListItem;
  tableBar: any;
  constructor() {}

  ngOnInit() {
    this.tableBar = {
      category: 'app-table-card',
      type: 'rlp-table-bar',
      status: 404,
      title: 'Preferred Specialist Referral Rate',
      data: {
        gdata: {
          count: '88/152',
          percentage: this.tableItem.graphData.total
        }
      },
      timeperiod: 'YTD (Jan 1, 2020—Mar 31, 2020)'
    };
  }
}
