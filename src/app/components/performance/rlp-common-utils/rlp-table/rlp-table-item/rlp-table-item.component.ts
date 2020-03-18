import { Component, OnInit, Input, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

interface IListItem {
  tin: string;
  groupName: string;
  graphData: any;
}
@Component({
  selector: 'app-rlp-table-item',
  templateUrl: './rlp-table-item.component.html',
  styleUrls: ['./rlp-table-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class RlpTableItemComponent implements OnInit, OnChanges {
  @Input() tableItem: IListItem;
  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit() {}
  ngOnChanges() {
    this.cd.markForCheck();
  }
}
