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
  constructor() {}

  ngOnInit() {}
}
