import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface IListItem {
  tin: string;
  groupName: string;
  graphData: any;
}
@Component({
  selector: 'app-rlp-table-item',
  templateUrl: './rlp-table-item.component.html',
  styleUrls: ['./rlp-table-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RlpTableItemComponent {
  @Input() tableItem: IListItem;
  constructor() {}
}
